package servlet.storage;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
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

public class PostInfo extends HttpServlet{
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
	
	private void InsertCartInfo(JSONArray array, PreparedStatement ps,
			Connection conn) throws JSONException, SQLException{
		HashMap<Integer,JSONObject> orderMap = new HashMap<Integer,JSONObject>();
		for(int i=0;i<array.length();i++){
			JSONObject infoobject = array.getJSONObject(i);
			if(!infoobject.has("ReceiverTel"))continue;
			String tel = infoobject.getString("ReceiverTel");
			ps = conn.prepareStatement(Constant.SQL_GET_CARTIDBYRECEIVERTEL);
			ps.setString(1, tel);
			JSONArray cartArray = new JSONArray();
			cartArray = DBController.getJsonArray(ps, conn);
			for(int j=0;j<cartArray.length();j++)
			{
				JSONObject cartObject = cartArray.getJSONObject(j);
				JSONArray orderArray = new JSONArray();
				if(!cartObject.has("ID"))continue;
				int cartID = cartObject.getInt("ID");
				ps = conn.prepareStatement(Constant.SQL_GET_ORDERBYCARTID);
				ps.setInt(1, cartID);
				orderArray = DBController.getJsonArray(ps, conn);
				for(int k=0;k<orderArray.length();k++){
					JSONObject orderObject = orderArray.getJSONObject(k);
					int saleid = orderObject.getInt("SaleProductID");
					if(orderMap.containsKey(saleid)){
						JSONObject countObject = orderMap.get(saleid);
						int currentamount = countObject.getInt("Amount");
						currentamount = currentamount + orderObject.getInt("Amount");
						countObject.put("Amount", currentamount);
					}else
					{
						JSONObject countObject = new JSONObject();
						int currentamount = orderObject.getInt("Amount");
						countObject.put("Amount", currentamount);
						countObject.put("SaleProductID", saleid);
						ps = conn.prepareStatement(Constant.SQL_GET_TITLEPICFROMSALE);
						ps.setInt(1, saleid);
						JSONArray titlearray = DBController.getJsonArray(ps, conn);
						JSONObject titleObject = titlearray.getJSONObject(0);
						String title = titleObject.getString("Title");
						String pic1 = titleObject.getString("Picture1");
						countObject.put("Title", title);
						countObject.put("Picture1", pic1);
						orderMap.put(saleid, countObject);
					}
				}
				
			}
			JSONArray ordersumArray = new JSONArray();
			Iterator iter = orderMap.entrySet().iterator();
			while (iter.hasNext()) { 
				Map.Entry entry = (Map.Entry) iter.next(); 
				Object key = entry.getKey(); 
				Object val = entry.getValue();
				ordersumArray.put(val);
			}
			infoobject.put("orders", ordersumArray);
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
//		long serverstartTimeLong = Long.parseLong(req.getParameter("fromtime").trim());
//		Date serverstartDate= new Date(serverstartTimeLong);
//		java.sql.Timestamp sqlstartDate=new java.sql.Timestamp(serverstartDate.getTime());
//		long serverendTimeLong = Long.parseLong(req.getParameter("endtime").trim());
//		Date serverendDate= new Date(serverendTimeLong);
//		java.sql.Timestamp sqlendDate=new java.sql.Timestamp(serverendDate.getTime());
		
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
			
			ps = conn.prepareStatement(Constant.SQL_GET_RECEIVERLIST);
			JSONArray array = DBController.getJsonArray(ps, conn);
			
			InsertCartInfo(array,ps,conn);
			
			
			endDate = new Date();
			jObject = HttpUtil.getResponseJson(true, array, endDate.getTime() - beginDate.getTime(), null,-1,-1,-1);
			writer.append(jObject.toString());

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
					if(object.has("ReceiverTel")&&object.has("PostNum"))
					{
						String tel = object.getString("ReceiverTel");
						String postNum = object.getString("PostNum");
						ps = conn.prepareStatement(Constant.SQL_UPDATE_POSTNUMBYTEL);
						ps.setString(1, postNum);
						ps.setString(2, tel);
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
