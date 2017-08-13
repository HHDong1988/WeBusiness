package servlet.sales;

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

public class Order extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	private int getUserID(HttpServletRequest req,Connection conn){
		return 41;
//		Cookie[] cookies = req.getCookies();
//		String username = null;
//		if (cookies != null) {
//			for (Cookie c : cookies) {
//				if (c.getName().equals("username")) {
//					username = c.getValue();
//				}
//			}
//			PreparedStatement ps = null;
//			try {
//				ps = conn.prepareStatement(Constant.SQL_SELECT_USERIDBYNAME);
//				ps.setString(1, username);
//				int id = DBController.getIntNumber(ps, conn);
//				return id;
//			} catch (SQLException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//				return -1;
//			}
//			
//				
//		}
//		return -1;
	}
	
	
	private Boolean InsertOrders(int cartId, int saleProductID, int productID, double price, int amount,
			Date beginDate,Connection conn){
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement(Constant.SQL_INSERT_ORDER);
			ps.setInt(1, cartId);
			ps.setInt(2, saleProductID);
			ps.setDouble(3, price);
			ps.setInt(4, amount);
			java.sql.Timestamp sqlDate=new java.sql.Timestamp(beginDate.getTime());
			ps.setObject(5, sqlDate);
			int count = ps.executeUpdate();
			if(count<=0)return false;
			ps = conn.prepareStatement(Constant.SQL_UPDATE_REDUCESTORAGEAMOUNT);
			ps.setInt(1, amount);
			ps.setInt(2, amount);
			ps.setInt(3, productID);
			count = ps.executeUpdate();
			if(count<=0)return false;
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
		return false;
	}
	
	private int InsertCart(int userId, String receiverName,String receiverTel, String reveiver,
			int totalCount, double totalPrice, String postNum,Connection conn){
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement(Constant.SQL_INSERT_CART);
			ps.setInt(1, userId);
			ps.setString(2, receiverName);
			ps.setString(3, receiverTel);
			ps.setString(4, reveiver);
			ps.setInt(5, totalCount);
			ps.setDouble(6, totalPrice);
			ps.setString(7, postNum);
			int itemCount = ps.executeUpdate();
			if(itemCount<=0)return -1;
			ps = conn.prepareStatement(Constant.SQL_Get_AUTOID);
			int cartID = DBController.getIntNumber(ps, conn);
			return cartID;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return -1;
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
//		if(!HttpUtil.doBeforeProcessing(req)){
//			endDate = new Date();
//			jObject = HttpUtil.getResponseJson(false, null,
//					endDate.getTime() - beginDate.getTime(), Constant.COMMON_ERROR,0,1,-1);
//			writer.append(jObject.toString());
//			writer.close();
//			return;
//		}
		
		String pJasonStr = GetRequestJsonUtils.getRequestJsonString(req);
		JSONObject object;
		
		try {
			object = new JSONObject(pJasonStr);
			conn = DBController.getConnection();
			
			JSONArray orderArray;
			double totalPrice=.0;
			int totalAmount=0;
			if(!object.has("ReceiverName")||!object.has("ReceiverTel")||!object.has("ReceiverAddr")
					||!object.has("PostNum")||!object.has("Orders")){
				endDate=new Date();
				jObject = HttpUtil.getResponseJson(false, null, endDate.getTime() - beginDate.getTime(), 
						"please check input data, it may lack of ReceiverName or ReceiverTel "
						+ "or ReceiverAddr or PostNum or Orders",0,1,-1);
				writer.append(jObject.toString());
				return;
			}
			int userID = getUserID(req,conn);
			String receiverName = object.getString("ReceiverName");
			String receiverTel = object.getString("ReceiverTel");
			String receiverAddr = object.getString("ReceiverAddr");
			String postNum = object.getString("PostNum");
			
			
			orderArray = object.getJSONArray("Orders");
			if(orderArray!=null){
				for(int i=0;i<orderArray.length();i++){
					JSONObject oderitem= orderArray.getJSONObject(i);
					int salesID = oderitem.getInt("SaleProductID");
					int amount = oderitem.getInt("Amount");
					ps = conn.prepareStatement(Constant.SQL_GET_SALESPRODUCTPRICEANDPRODUCTID);
					ps.setInt(1, salesID);
					JSONArray array = DBController.getJsonArray(ps, conn);
					if(array.length()==0){
						endDate=new Date();
						jObject = HttpUtil.getResponseJson(false, null, endDate.getTime() - beginDate.getTime(), 
								"get sales info failed, sales id:"+salesID,0,1,-1);
						writer.append(jObject.toString());
						return;
					}
					JSONObject item = array.getJSONObject(0);
					double itemprice = item.getDouble("Price");
					int productId = item.getInt("ProductID");
					oderitem.put("Price", itemprice);
					oderitem.put("ProductID", productId);
					totalPrice+=itemprice*amount;
					totalAmount+=amount;
				}
			}
			
			int cartId = InsertCart(userID,receiverName,receiverTel,receiverAddr,
					totalAmount,totalPrice,postNum,conn);
			if(cartId==-1){
				endDate=new Date();
				jObject = HttpUtil.getResponseJson(false, null, endDate.getTime() - beginDate.getTime(), 
						"cartId is empty, insert data_cart failed",0,1,-1);
				writer.append(jObject.toString());
				return;
			}
			
			if(orderArray!=null){
				for(int i=0;i<orderArray.length();i++){
					JSONObject oderitem= orderArray.getJSONObject(i);
					int productID = oderitem.getInt("ProductID");
					int saleProductID = oderitem.getInt("SaleProductID");
					int amount = oderitem.getInt("Amount");
					double price = oderitem.getDouble("Price");
					Boolean insertResult = InsertOrders(cartId, saleProductID,productID, price, 
							amount,beginDate,conn);
					if(!insertResult){
						endDate=new Date();
						jObject = HttpUtil.getResponseJson(false, null, endDate.getTime() - beginDate.getTime(), 
								"insert order failed",0,1,-1);
						writer.append(jObject.toString());
						return;
					}
				}
			}

			endDate=new Date();
			jObject = HttpUtil.getResponseJson(true, null, endDate.getTime() - beginDate.getTime(), null,0,1,-1);
			writer.append(jObject.toString());
			writer.close();
			conn.close();
		} catch (SQLException |JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}