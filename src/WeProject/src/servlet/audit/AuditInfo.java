package servlet.audit;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import com.constant.Constant;
import com.database.DBController;
import com.util.GetRequestJsonUtils;
import com.util.HttpUtil;

public class AuditInfo  extends HttpServlet{
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
				
				if(usertypeid==Constant.Super_Admin_Id||usertypeid==Constant.Accountant_Id)return true;
			} catch (SQLException | JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}
			
				
		}
		return false;
	}
	
	private void IntertOrderInformationToCartMap(JSONArray array, HashMap<Integer,JSONArray> cartMap, 
			HashMap<Integer, Object> cartTimemap,PreparedStatement ps,
			Connection conn) throws JSONException, SQLException{
		for(int i=0;i<array.length();i++){
			JSONObject object = array.getJSONObject(i);
			if(!object.has("CartID"))continue;
			int cartID = object.getInt("CartID");
			ps = conn.prepareStatement(Constant.SQL_GET_TITLEPICFROMSALE);
			int saleproductID = object.getInt("SaleProductID");
			ps.setInt(1, saleproductID);
			JSONArray procutinfoArray = DBController.getJsonArray(ps, conn);
			if(procutinfoArray.length()<=0)continue;
			JSONObject procutTitleAndPic = procutinfoArray.getJSONObject(0);
			object.put("Title", procutTitleAndPic.get("Title"));
			object.put("Picture1", procutTitleAndPic.get("Picture1"));
			
			if(cartMap.containsKey(cartID))
			{
				JSONArray orders = cartMap.get(cartID);
				orders.put(object);
			}else
			{
				JSONArray orders = new JSONArray();
				orders.put(object);
				cartMap.put(cartID, orders);
			}
			if(!cartTimemap.containsKey(cartID))
			{
				Object date = object.get("LogTime");
				cartTimemap.put(cartID, date);
			}
			
		}
	}
	
	private void SummaryInfoToReturnArray(HashMap<Integer,JSONArray> cartMap, 
			HashMap<Integer, Object> cartTimemap,JSONArray returnArray,PreparedStatement ps,
			Connection conn) throws JSONException, SQLException{
		Iterator iter = cartMap.entrySet().iterator();
		while (iter.hasNext()) { 
			Map.Entry entry = (Map.Entry) iter.next(); 
			Object key = entry.getKey(); 
			Object val = entry.getValue();
			int id = (Integer)key;
			JSONObject cartJsonObject = new JSONObject();
			cartJsonObject.put("cartid", id);
			cartJsonObject.put("orders", val);
			ps = conn.prepareStatement(Constant.SQL_Get_PriceBYCartID);
			ps.setInt(1, id);
			Double totalprice = DBController.getDoubleNumber(ps, conn);
			cartJsonObject.put("price", totalprice);
			if(cartTimemap.containsKey(id))
			{
				cartJsonObject.put("carttime", cartTimemap.get(id));
			}
			returnArray.put(cartJsonObject);
		}
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
//		if(!HttpUtil.doBeforeProcessing(req)){
//			endDate = new Date();
//			jObject = HttpUtil.getResponseJson(false, null,
//					endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
//			writer.append(jObject.toString());
//			writer.close();
//			return;
//		}
		long serverstartTimeLong = Long.parseLong(req.getParameter("fromtime").trim());
		Date serverstartDate= new Date(serverstartTimeLong);
		java.sql.Timestamp sqlstartDate=new java.sql.Timestamp(serverstartDate.getTime());
		long serverendTimeLong = Long.parseLong(req.getParameter("endtime").trim());
		Date serverendDate= new Date(serverendTimeLong);
		java.sql.Timestamp sqlendDate=new java.sql.Timestamp(serverendDate.getTime());
		int userId = -1;
		String userIdString = req.getParameter("userid");
		userId = Integer.parseInt(userIdString);
		
		try {
			conn = DBController.getConnection();
//			if(!HasAuthority(req,conn,null)){
//				endDate = new Date();
//				jObject = HttpUtil.getResponseJson(false, null,
//						endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
//				writer.append(jObject.toString());
//				writer.close();
//				conn.close();
//				return;
//			}
			JSONArray returnArray= new JSONArray();
			
			ps = conn.prepareStatement(Constant.SQL_Get_OrderByIDAndTime);
			ps.setObject(1, sqlstartDate);
			ps.setObject(2, sqlendDate);
			ps.setInt(3, userId);
			JSONArray array = DBController.getJsonArray(ps, conn);
			HashMap<Integer,JSONArray> cartMap=new HashMap<Integer,JSONArray>();
			HashMap<Integer, Object> cartTimemap = new HashMap<Integer,Object>();
			
			IntertOrderInformationToCartMap(array,cartMap,cartTimemap,ps,conn);
			
			SummaryInfoToReturnArray(cartMap, cartTimemap,returnArray,ps,conn);
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
	
	 // Insert
		@Override
		protected void doPost(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
			Date beginDate = new Date();
			Date endDate = null;
			resp.setContentType("application/json; charset=utf-8");
			resp.setCharacterEncoding("UTF-8");
			Connection conn = null;
			PreparedStatement ps = null;
			PrintWriter writer = resp.getWriter();
			JSONObject jObject = null;
//			if(!HttpUtil.doBeforeProcessing(req)){
//				endDate = new Date();
//				jObject = HttpUtil.getResponseJson(false, null,
//						endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
//				writer.append(jObject.toString());
//				writer.close();
//				return;
//			}
			
			String pJasonStr = GetRequestJsonUtils.getRequestJsonString(req);
			JSONArray array;
			
			try {
				array = new JSONArray(pJasonStr);
				conn = DBController.getConnection();
				boolean updateresult=true;
				
//				if(!HasAuthority(req,conn,null)){
//					endDate = new Date();
//					jObject = HttpUtil.getResponseJson(false, null,
//							endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
//					writer.append(jObject.toString());
//					writer.close();
//					conn.close();
//					return;
//				}
				for(int i=0;i<array.length();i++){
					JSONObject object = array.getJSONObject(i);
					if(object.has("cartid"))
					{
						int cartid = object.getInt("cartid");
						ps = conn.prepareStatement(Constant.SQL_UPDATE_PostPassAudit);
						ps.setInt(1, cartid);
						int itemCount = ps.executeUpdate();
						if(itemCount<=0){
							updateresult = false;
							break;
						}
					}
				}
				endDate=new Date();
				//ToDo: Check This
				if(updateresult){
					jObject = HttpUtil.getResponseJson(true, null,
							endDate.getTime() - beginDate.getTime(), "success",0,1,-1);
					writer.append(jObject.toString());
				}else
				{
					jObject = HttpUtil.getResponseJson(false, null, endDate.getTime() - beginDate.getTime(), null,0,1,-1);
					writer.append(jObject.toString());
				}
				writer.close();
				conn.close();
			} catch (SQLException |JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	
}