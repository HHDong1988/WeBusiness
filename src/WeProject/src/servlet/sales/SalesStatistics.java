package servlet.sales;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

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
			if(productId!=-1){
				ps = conn.prepareStatement(Constant.SQL_GET_ORDERINFOSTATISTICS+Constant.SQL_GET_ORDERINFOSTATISTICSIDCondition);
				ps.setObject(1, sqlstartDate);
				ps.setObject(2, sqlendDate);
				ps.setInt(3, productId);
			}else{
				ps = conn.prepareStatement(Constant.SQL_GET_ORDERINFOSTATISTICS);
				ps.setObject(1, sqlstartDate);
				ps.setObject(2, sqlendDate);
			}
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
			endDate = new Date();
			if(array==null||(array!=null&&array.length()==0)){
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.DATEBASEEMPTY_ERROR,0,1,-1);
				writer.append(jObject.toString());
			}else
			{
				jObject = HttpUtil.getResponseJsonDataIsObject(true, returnObject, endDate.getTime() - beginDate.getTime(), null,-1,-1,-1);
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
