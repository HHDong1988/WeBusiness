package servlet.storage;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Date;

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

public class PostExcel  extends HttpServlet{
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
				cartObject.put("orders", orderArray);
			}
			infoobject.put("carts", cartArray);
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
			Date date = new Date();
			String fileName = "dingdan"+date.getTime()+".csv";
			ps = conn.prepareStatement(Constant.SQL_GET_RECEIVERLIST);
			JSONArray array = DBController.getJsonArray(ps, conn);
			
			InsertCartInfo(array,ps,conn);
			resp.setCharacterEncoding("gbk");  
			resp.setContentType(getServletContext().getMimeType(fileName));  
	        // **********设置以附件打开***********  
			resp.setHeader("Content-Disposition", "attachment;filename="  
	                + fileName);  
	                //~~~~~~~~~~~~~~~~~~~~~~~~~~~~核心代码~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
	        // 2、导出csv文件  
	        PrintWriter pw = resp.getWriter();  
	  
	        // 3、通过response输出流 输出csv文件  
	        pw.println("收货人姓名,电话,地址");  
	        for (int i = 0; i < array.length(); i++) {  
	            JSONObject info = array.getJSONObject(i);
	            String receivername;
	            String tel;
	            String address;
	            if(!info.has("ReceiverName")||!info.has("ReceiverTel")
	            		||!info.has("ReceiverAddr"))continue;
	            receivername = info.getString("ReceiverName");
	            tel = info.getString("ReceiverTel");
	            address = info.getString("ReceiverAddr");
	            pw.println(convert(receivername) + ","  
	                    + convert(tel) + "," +convert(address));  
	        }  
	        pw.close(); 
			
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
	
	 // 若输出信息含有特殊字符，处理csv 表格中特殊字符的方法  
    public String convert(String value) {  
        // 将value中" 换成""  
        value = value.replace("\"", "\"\"");  
        // 将回车换行符 换成换行符  
        value = value.replace("\r\n", "\n");  
        // 如果存在, 只要在value 两端加入 ""  
        return "\"" + value + "\"";  
    }
    
 // Insert
 		@Override
 		protected void doPost(HttpServletRequest req, HttpServletResponse resp)
 				throws ServletException, IOException {
 			doGet(req,resp);
 		}
}
