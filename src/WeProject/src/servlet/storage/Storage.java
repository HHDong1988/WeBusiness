package servlet.storage;
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
public class Storage extends HttpServlet{
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
	
	private JSONArray InsertProduct(Connection conn,JSONArray array) 
			throws JSONException{
		JSONArray occpupylist=new JSONArray();
		for(int i=0;i<array.length();i++)
		{
			JSONObject object = (JSONObject)array.get(i);
			if(object==null)return null;
			String name = ((String) object.get("Name")).trim();
			PreparedStatement ps;
			try {
				ps = conn.prepareStatement(Constant.SQL_CHECK_PRODUCTEXIST);
				ps.setString(1, name);
				JSONArray result = DBController.getJsonArray(ps, conn);
				if(result.length()>0){
					array.remove(i);
					i--;
					occpupylist.put(name);
				}
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return null;
			}

		}
		Boolean result = DBController.ExecuteMultipleInsert(conn, "data_storage_products", array);
		if(result)return occpupylist;
		else return null;
	}
	
	private Boolean UpdateProducts(Connection conn,JSONArray array) {
		for(int i=0;i<array.length();i++)
		{
			try {
				JSONObject object = array.getJSONObject(i);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}
		}
		Boolean result = DBController.ExecuteMultipleUpdate(conn, "data_storage_products", array, "ID");
		return result;
	}
	
	//get
	@Override
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
		int iPageNum = Integer.parseInt(req.getParameter("page").trim());
		int iPagesize = Integer.parseInt(req.getParameter("pageSize").trim());
		int total=0;
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
			
			ps = conn.prepareStatement(Constant.SQL_GET_STORAGEITEMCOUNT);
			JSONArray jArrTotalArray = null;
			try {
				jArrTotalArray = DBController.getJsonArray(ps, conn);
				if(jArrTotalArray != null && jArrTotalArray.length() > 0){
					total = jArrTotalArray.getJSONObject(0).getInt("total");
				} else {
					total = 0;
				}
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

            int startPoint =iPagesize * (iPageNum-1);
			//iPagesize * (iPageNum-1) +" ," + iPagesize
			
			ps = conn.prepareStatement(Constant.SQL_GET_STORAGEBYPAGE);
			
			ps.setInt(1, startPoint);
			ps.setInt(2, iPagesize);
			JSONArray array = DBController.getJsonArray(ps, conn);

			endDate = new Date();
			if(array==null||(array!=null&&array.length()==0)){
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.DATEBASEEMPTY_ERROR,0,1,-1);
				writer.append(jObject.toString());
			}else
			{
				for(int i=0;i<array.length();i++){
					try {
						JSONObject item = array.getJSONObject(i);
						int currentAmount = item.getInt("CurrentAmount");
						int soldAmount = item.getInt("SoldAmount");
						int totalAmount = currentAmount+soldAmount;
						item.put("TotalAmount", totalAmount);
					} catch (JSONException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
				jObject = HttpUtil.getResponseJson(true, array, endDate.getTime() - beginDate.getTime(), null,total,iPageNum,iPagesize);
				writer.append(jObject.toString());
			}

			writer.close();
			conn.close();
		} catch (SQLException  e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	// Update
		@Override
		protected void doPut(HttpServletRequest req, HttpServletResponse resp)
				throws ServletException, IOException {
		
		}
		
	
    //delete
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
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
		if(!HttpUtil.doBeforeProcessing(req)){
			endDate = new Date();
			jObject = HttpUtil.getResponseJson(false, null,
					endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
			writer.append(jObject.toString());
			writer.close();
			return;
		}
		
		String pJasonStr = GetRequestJsonUtils.getRequestJsonString(req);
		JSONObject object;
		
		try {
			object = new JSONObject(pJasonStr);
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
			JSONArray tempArray;
			JSONArray nameOccupyList=new JSONArray();
			Boolean editResult=true;
			Boolean deleteResult=true;
			if(object.has("Add")){
				tempArray = object.getJSONArray("Add");
				if(tempArray!=null){
					nameOccupyList = InsertProduct(conn,tempArray); 
				}
				
			}
			if(object.has("Edit")){
				tempArray = object.getJSONArray("Edit");
				if(tempArray!=null){
					editResult = UpdateProducts(conn, tempArray); 
				}
			}
			
			endDate=new Date();
			if(deleteResult&&editResult&&nameOccupyList!=null){
				jObject = HttpUtil.getResponseJson(true, nameOccupyList,
						endDate.getTime() - beginDate.getTime(), Constant.DATEBASE_ERROR,0,1,-1);
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
