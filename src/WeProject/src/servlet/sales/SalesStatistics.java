package servlet.sales;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;















import com.constant.Constant;
import com.database.DBController;
import com.util.GetRequestJsonUtils;
import com.util.HttpUtil;
import com.util.MD5Util;

public class SalesStatistics extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	private Boolean HasAuthority(HttpServletRequest req,Connection conn, String targetUserName){
		Cookie[] cookies = req.getCookies();
		String username = null;
		if (cookies != null) {
			for (Cookie c : cookies) {
				if (c.getName().equals("username")) {
					username = c.getValue();
				}
			}
			PreparedStatement ps = null;
			try {
				ps = conn.prepareStatement(Constant.SQL_SELECT_USERTypeId);
				ps.setString(1, username);
				JSONArray array = DBController.getJsonArray(ps, conn);
				array.length();
				JSONObject userobject = array.getJSONObject(0);
				int usertypeid = userobject.getInt("UserTypeID");
				
				if(usertypeid==Constant.Super_Admin_Id||usertypeid==Constant.Storekeeper_Id)return true;
			} catch (SQLException | JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}
			
				
		}
		return false;
	}
	
	@SuppressWarnings("deprecation")
	private JSONArray GetResponseArrayUsingID(int productId,java.sql.Timestamp sqlstartDate,
			java.sql.Timestamp sqlendDate,Connection conn,PreparedStatement ps) throws SQLException, JSONException{
		JSONArray returnArray = new JSONArray();
		ps = conn.prepareStatement(Constant.SQL_GET_ORDERINFOSTATISTICS+Constant.SQL_GET_ORDERINFOSTATISTICSIDCondition);
		ps.setObject(1, sqlstartDate);
		ps.setObject(2, sqlendDate);
		ps.setInt(3, productId);
		JSONArray array = DBController.getJsonArray(ps, conn);
		HashMap<Long,Integer> dayCountMap= new HashMap<Long,Integer>();
		for(int i=0;i<array.length();i++){
			JSONObject object = array.getJSONObject(i);
			if(!object.has("Amount")||!object.has("LogTime"))continue;
			int itemAmount = object.getInt("Amount");
			java.sql.Timestamp sqlDate = (Timestamp) object.get("LogTime");
			Calendar gcOriginal =  Calendar.getInstance();
			gcOriginal.setTime(sqlDate);
			Calendar gc =  Calendar.getInstance();
			gc.set(gcOriginal.get(Calendar.YEAR), gcOriginal.get(Calendar.MONTH),gcOriginal.get(Calendar.DAY_OF_MONTH));
			long timeLong = gc.getTime().getTime();
			if(dayCountMap.containsKey(timeLong)){
				int originalCount = dayCountMap.get(timeLong);
				int total = originalCount+itemAmount;
				dayCountMap.put(timeLong, total);
			}else
			{
				dayCountMap.put(timeLong, itemAmount);
			}
		}
		Iterator iterator = dayCountMap.entrySet().iterator();
		while(iterator.hasNext()){
			JSONObject returnObject = new JSONObject();
			Map.Entry entry = (Map.Entry) iterator.next();
			Long key = (Long)entry.getKey();
			Integer val = (Integer)entry.getValue();
			Calendar gc =  Calendar.getInstance();
			gc.setTimeInMillis(key);
			returnObject.put("Year", gc.get(Calendar.YEAR)+1900);
			returnObject.put("Month", gc.get(Calendar.MONTH)+1);
			returnObject.put("Day", gc.get(Calendar.DAY_OF_MONTH));
			returnObject.put("SoldAmount", val);
			returnArray.put(returnObject);
		}
		return returnArray;
	}
	
	
	private JSONArray GetResponseArrayWithoutID(java.sql.Timestamp sqlstartDate,java.sql.Timestamp sqlendDate,
			Connection conn,PreparedStatement ps) throws SQLException, JSONException{
		JSONArray returnArray = new JSONArray();
		ps = conn.prepareStatement(Constant.SQL_GET_ORDERINFOSTATISTICS);
		ps.setObject(1, sqlstartDate);
		ps.setObject(2, sqlendDate);
		JSONArray array = DBController.getJsonArray(ps, conn);
		
		JSONObject returnObject = new JSONObject();
		for(int i=0;i<array.length();i++){
			JSONObject object = array.getJSONObject(i);
			if(!object.has("ProductID")||!object.has("Amount"))continue;
			int itemId = object.getInt("ProductID");
			int itemAmount = object.getInt("Amount");
			if(returnObject.has(itemId+"")){
				int originalCount = returnObject.getInt(itemId+"");
				int total = originalCount+itemAmount;
				returnObject.put(itemId+"", total);
			}else
			{
				returnObject.put(itemId+"", itemAmount);
			}
		}
		Iterator iterator = returnObject.keys();
		while(iterator.hasNext()){
			String key = (String) iterator.next();
			int value = returnObject.getInt(key);
			int idValue=Integer.parseInt(key);
			JSONObject jobject = new JSONObject();
			jobject.put("ProductID", idValue);
			jobject.put("SoldAmount", value);
			returnArray.put(jobject);
		}
		
		return returnArray;
	}

	
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		// super.doGet(req, resp);
		Date beginDate = new Date();
		Date endDate = null;
		resp.setContentType("application/json; charset=utf-8");
		resp.setCharacterEncoding("UTF-8");
		Connection conn = null;
		PreparedStatement ps = null;
		PrintWriter writer = resp.getWriter();
		JSONObject jObject = null;
		if(!HttpUtil.doBeforeProcessing(req)){
			endDate = new Date();
			jObject = HttpUtil.getResponseJson(false, null,
					endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
			writer.append(jObject.toString());
			writer.close();
			return;
		}
		long serverstartTimeLong = Long.parseLong(req.getParameter("startTime").trim());
		Date serverstartDate= new Date(serverstartTimeLong);
		java.sql.Timestamp sqlstartDate=new java.sql.Timestamp(serverstartDate.getTime());
		long serverendTimeLong = Long.parseLong(req.getParameter("endTime").trim());
		Date serverendDate= new Date(serverendTimeLong);
		java.sql.Timestamp sqlendDate=new java.sql.Timestamp(serverendDate.getTime());
		int productId = -1;
		String productIdString = req.getParameter("productID");
		if(productIdString!=null){
			productId=Integer.parseInt(productIdString);
		}
		
		try {
			conn = DBController.getConnection();
			if(!HasAuthority(req,conn,null)){
				endDate = new Date();
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
				writer.append(jObject.toString());
				writer.close();
				conn.close();
				return;
			}
			JSONArray returnArray=null;
			
			if(productId!=-1){
				returnArray = GetResponseArrayUsingID(productId,sqlstartDate,sqlendDate,conn,ps);
			}else{
				returnArray = GetResponseArrayWithoutID(sqlstartDate,sqlendDate,conn,ps);
			}
			
			
			endDate = new Date();
			if(returnArray==null||(returnArray!=null&&returnArray.length()==0)){
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.DATEBASEEMPTY_ERROR,0,1,-1);
				writer.append(jObject.toString());
			}else
			{
				jObject = HttpUtil.getResponseJson(true, returnArray, endDate.getTime() - beginDate.getTime(), null,-1,-1,-1);
				writer.append(jObject.toString());
			}

			writer.close();
			conn.close();
		} catch (SQLException  e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
