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
			HashMap<Integer, JSONObject> cartInfoMap,PreparedStatement ps,
			Connection conn) throws JSONException, SQLException{
		for(int i=0;i<array.length();i++){
			JSONObject object = array.getJSONObject(i);
			if(!object.has("CartID"))continue;
			int cartID = object.getInt("CartID");
			ps = conn.prepareStatement(Constant.SQL_GET_TITLEPICFROMSALE);
			int saleproductID = object.getInt("SaleProductID");
			ps.setInt(1, saleproductID);
			int salerid = object.getInt("SalerID");
			JSONArray procutinfoArray = DBController.getJsonArray(ps, conn);
			if(procutinfoArray.length()<=0)continue;
			JSONObject procutTitleAndPic = procutinfoArray.getJSONObject(0);
			object.put("Title", procutTitleAndPic.get("Title"));
			object.put("Picture1", procutTitleAndPic.get("Picture1"));
			ps = conn.prepareStatement(Constant.SQL_GET_USERSBYID);
			ps.setInt(1, salerid);
			JSONArray namearray = DBController.getJsonArray(ps, conn);
			if(namearray.length()<=0)continue;
			JSONObject nameObject = namearray.getJSONObject(0);
			String salerName = nameObject.getString("UserName");
			object.put("SalerID", salerid);
			object.put("SalerName", salerName);
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
			if(!cartInfoMap.containsKey(cartID))
			{
				JSONObject cartinfo = new JSONObject();
				cartinfo.put("LogTime", object.get("LogTime"));
				cartinfo.put("SalerID", salerid);
				cartinfo.put("SalerName", salerName);
				cartInfoMap.put(cartID, cartinfo);
			}
			
		}
	}
	
	private void SummaryInfoToReturnArray(HashMap<Integer,JSONArray> cartMap, 
			HashMap<Integer, JSONObject> cartInfoMap,JSONArray returnArray,PreparedStatement ps,
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
			ps = conn.prepareStatement(Constant.SQL_Get_PricePassAuditBYCartID);
			ps.setInt(1, id);
			JSONArray cartPriceAndPassinfoArray = DBController.getJsonArray(ps, conn);
			if(cartPriceAndPassinfoArray.length()>0)
			{
				JSONObject cartinfoObject = cartPriceAndPassinfoArray.getJSONObject(0);
				if(cartinfoObject.has("TotalPrice")){
					double totalprice = cartinfoObject.getDouble("TotalPrice");
					cartJsonObject.put("price", totalprice);
				}
				if(cartinfoObject.has("PassAudit")){
					boolean pass = cartinfoObject.getBoolean("PassAudit");
					cartJsonObject.put("PassAudit", pass);
				}
			}
			
			if(cartInfoMap.containsKey(id))
			{
				JSONObject cartinfo = cartInfoMap.get(id);
				cartJsonObject.put("carttime", cartinfo.get("LogTime"));
				cartJsonObject.put("SalerID", cartinfo.getInt("SalerID"));
				cartJsonObject.put("SalerName", cartinfo.getString("SalerName"));
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
			JSONArray array = DBController.getJsonArray(ps, conn);
			HashMap<Integer,JSONArray> cartMap=new HashMap<Integer,JSONArray>();
			HashMap<Integer, JSONObject> cartInfoMap = new HashMap<Integer,JSONObject>();
			
			IntertOrderInformationToCartMap(array,cartMap,cartInfoMap,ps,conn);
			
			SummaryInfoToReturnArray(cartMap, cartInfoMap,returnArray,ps,conn);
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
	
		//delete
		@Override
		protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException{
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
			int cartid = Integer.parseInt(req.getParameter("cartID").trim());
			
			try {
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
				
				ps = conn.prepareStatement(Constant.SQL_DELETE_CARTBYCARTID);
				ps.setInt(1, cartid);
				int itemCount = ps.executeUpdate();
				if(itemCount<=0){
					updateresult = false;
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
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
}