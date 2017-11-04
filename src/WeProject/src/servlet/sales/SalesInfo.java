package servlet.sales;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;





import sun.misc.BASE64Decoder;  
import sun.misc.BASE64Encoder;  






import com.constant.Constant;
import com.database.DBController;
import com.util.GetRequestJsonUtils;
import com.util.HttpUtil;
import com.util.MD5Util;
public class SalesInfo extends HttpServlet{
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
				
				if(usertypeid==Constant.Super_Admin_Id||usertypeid==Constant.Storekeeper_Id
						||usertypeid==Constant.Assistant_Id||usertypeid==Constant.Admin_Id)return true;
			} catch (SQLException | JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return false;
			}
			
				
		}
		return false;
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
		Boolean hasId=false;
		String idString = req.getParameter("Id");
		if(idString!=null)hasId=true;
		int id =0;
		if(hasId){
			id = Integer.parseInt(idString);
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
			if(hasId){
				ps = conn.prepareStatement(Constant.SQL_GET_SALESINFOCOUNTBYPRODUCTID);
				ps.setInt(1, id);
			}else{
				ps = conn.prepareStatement(Constant.SQL_GET_SALESINFOCOUNT);
				
			}
			
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
			if(iPagesize==-1){
				if(hasId){
	            	ps = conn.prepareStatement(Constant.SQL_GET_SALESINFOBYPRODUCTID);
	    			ps.setInt(1, id);
	            }else
	            {
	            	ps = conn.prepareStatement(Constant.SQL_GET_SALESINFO);
	            }
			}else{
				if(hasId){
	            	ps = conn.prepareStatement(Constant.SQL_GET_SALESINFOBYPAGEBYPRODUCTID);
	    			ps.setInt(1, id);
	    			ps.setInt(2, startPoint);
	    			ps.setInt(3, iPagesize);
	            }else
	            {
	            	ps = conn.prepareStatement(Constant.SQL_GET_SALESINFOBYPAGE);
	            	ps.setInt(1, startPoint);
	    			ps.setInt(2, iPagesize);
	            }
			}
           
			
			JSONArray array = DBController.getJsonArray(ps, conn);

			endDate = new Date();
			if(array==null||(array!=null&&array.length()==0)){
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.DATEBASEEMPTY_ERROR,0,1,-1);
				writer.append(jObject.toString());
			}else
			{
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
		int id = Integer.parseInt(req.getParameter("id").trim());
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
			ps = conn.prepareStatement(Constant.SQL_GETPRODUCTOFFLIN);
			ps.setInt(1, id);
			int count = ps.executeUpdate();
			endDate=new Date();
			if(count>0){
				jObject = HttpUtil.getResponseJson(true, null,
						endDate.getTime() - beginDate.getTime(), "offline operation successfuly",0,1,-1);
				writer.append(jObject.toString());
			}else
			{
				jObject = HttpUtil.getResponseJson(false, null, 
						endDate.getTime() - beginDate.getTime(), "database error offline operation failed",0,1,-1);
				writer.append(jObject.toString());
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	private int getUserID(HttpServletRequest req,Connection conn){
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
				ps = conn.prepareStatement(Constant.SQL_SELECT_USERIDBYNAME);
				ps.setString(1, username);
				int id = DBController.getIntNumber(ps, conn);
				return id;
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return -1;
			}
			
				
		}
		return -1;
	}
	
	private Boolean Insert(JSONObject object, 
			int editerID, Connection conn) throws SQLException, JSONException{
		
		//SQL_INSERT_RECEIVER="INSERT INTO data_orderreciver (Name,Tel,Address,"
		//+ "SalerID) VALUES (?,?,?,?)";
		java.sql.Statement ps=conn.createStatement();
		StringBuilder sbForPrefix=new StringBuilder();
		StringBuilder sbForPostfix=new StringBuilder();
		sbForPrefix.append("insert into data_saleproducts (ProductID,Price,Title,"
				+ "Description,EditerID");
		
		JSONObject receiverInfo= object;
		if(!receiverInfo.has("ProductID")||!receiverInfo.has("Price")||
				!receiverInfo.has("Title")||!receiverInfo.has("Description"))return false;
		int productID = receiverInfo.getInt("ProductID");
		Double price = receiverInfo.getDouble("Price");
		String title = receiverInfo.getString("Title");
		String desciption = receiverInfo.getString("Description");
		sbForPostfix.append(productID+",");
		sbForPostfix.append(price+",");
		sbForPostfix.append("'"+title+"',");
		sbForPostfix.append("'"+desciption+"',");
		sbForPostfix.append(editerID);
		
		if(receiverInfo.has("Picture1")){
			String pictureStr = receiverInfo.getString("Picture1");
			if(!pictureStr.equals("")){
				String path = GenerateImageToServer(pictureStr);
				path = path.replace("\\", "\\\\");
				sbForPrefix.append(",Picture1");
				sbForPostfix.append(",'"+path+"'");
			}
			
		}
		if(receiverInfo.has("Picture2")){
			String pictureStr = receiverInfo.getString("Picture2");
			if(!pictureStr.equals("")){
				String path = GenerateImageToServer(pictureStr);
				path =path.replace("\\", "\\\\");
				sbForPrefix.append(",Picture2");
				sbForPostfix.append(",'"+path+"'");
			}
			
		}
		if(receiverInfo.has("Picture3")){
			String pictureStr = receiverInfo.getString("Picture3");
			if(!pictureStr.equals("")){
				String path = GenerateImageToServer(pictureStr);
				path =path.replace("\\", "\\\\");
				sbForPrefix.append(",Picture3");
				sbForPostfix.append(",'"+path+"'");
			}
			
		}
		if(receiverInfo.has("Picture4")){
			String pictureStr = receiverInfo.getString("Picture4");
			if(!pictureStr.equals("")){
				String path = GenerateImageToServer(pictureStr);
				path =path.replace("\\", "\\\\");
				sbForPrefix.append(",Picture4");
				sbForPostfix.append(",'"+path+"'");
			}
			
		}
		sbForPrefix.append(")");
		sbForPrefix.append(" VALUES (");
		sbForPostfix.append(");");
		
		String sqlstatement = sbForPrefix.toString()+sbForPostfix.toString();
		System.out.println(sqlstatement);
		ps.addBatch(sqlstatement);
		int[] counts = ps.executeBatch();
		if(counts!=null){
			for(int value :counts){
				if(value<=0)return false;
			}
		}
		
		PreparedStatement prepare = conn.prepareStatement(Constant.SQL_Get_AUTOID);
		int saleproductId = DBController.getIntNumber(prepare,conn);
		String webaddr = GenerateWebAddr(saleproductId);
		prepare = conn.prepareStatement(Constant.SQL_UPDATE_WEBADDRBYID);
		prepare.setString(1, webaddr);
		prepare.setInt(2,saleproductId);
		int itemCount = prepare.executeUpdate();
		if(itemCount<=0){
			return false;
		}
		return true;
	}
	
	private String GenerateWebAddr(int saleproductID){
		return "mobile/#!/productDetail/"+saleproductID;
	}
	
	private Boolean Uupdate(JSONObject object, 
			int salerID, Connection conn) throws SQLException, JSONException{
//		"UPDATE data_orderreciver "
//		+ "SET Name = ?, Tel = ? Address =? "
//		+ "WHERE ID = ?";
		
		java.sql.Statement ps=conn.createStatement();
		StringBuilder sb=new StringBuilder();
		sb.append("UPDATE data_saleproducts SET ");
		JSONObject receiverInfo= object;
		int id = receiverInfo.getInt("ID");
		Boolean hasItem = false;
		if(receiverInfo.has("ProductID")){
			int productID = receiverInfo.getInt("ProductID");
			if(hasItem){
				sb.append(",");
			}
			sb.append("ProductID = "+productID);
			hasItem=true;
		}
		if(receiverInfo.has("Price")){
			Double price = receiverInfo.getDouble("Price");
			if(hasItem){
				sb.append(",");
			}
			sb.append("Price = '"+price+"'");
			hasItem=true;
		}
		if(receiverInfo.has("Title")){
			String title = receiverInfo.getString("Title");
			if(hasItem){
				sb.append(",");
			}
			sb.append("Title = '"+title+"'");
			hasItem=true;
		}
		if(receiverInfo.has("Online")){
			int online = receiverInfo.getInt("Online");
			if(hasItem){
				sb.append(",");
			}
			sb.append("Title = "+online);
			hasItem=true;
		}
		if(receiverInfo.has("Description")){
			String description = receiverInfo.getString("Description");
			if(hasItem){
				sb.append(",");
			}
			sb.append("Description = '"+description+"'");
			hasItem=true;
		}
		if(receiverInfo.has("Picture1")){
			String pictureStr = receiverInfo.getString("Picture1");
			String path = GenerateImageToServer(pictureStr);
			if(hasItem){
				sb.append(",");
			}
			sb.append("Picture1 = '"+path+"'");
			hasItem=true;
		}
		if(receiverInfo.has("Picture2")){
			String pictureStr = receiverInfo.getString("Picture2");
			String path = GenerateImageToServer(pictureStr);
			if(hasItem){
				sb.append(",");
			}
			sb.append("Picture2 = '"+path+"'");
			hasItem=true;
		}
		if(receiverInfo.has("Picture3")){
			String pictureStr = receiverInfo.getString("Picture3");
			String path = GenerateImageToServer(pictureStr);
			if(hasItem){
				sb.append(",");
			}
			sb.append("Picture3 = '"+path+"'");
			hasItem=true;
		}
		if(receiverInfo.has("Picture4")){
			String pictureStr = receiverInfo.getString("Picture4");
			String path = GenerateImageToServer(pictureStr);
			if(hasItem){
				sb.append(",");
			}
			sb.append("Picture4 = '"+path+"'");
			hasItem=true;
		}
		
		sb.append(" WHERE ID = "+id);
		ps.addBatch(sb.toString());
		int[] counts = ps.executeBatch();
		if(counts!=null){
			for(int value :counts){
				if(value<=0)return false;
			}
		}
		return true;
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
			pJasonStr = pJasonStr.replace(" ", "");
			object = new JSONObject(pJasonStr);
			conn = DBController.getConnection();
			int salerID = getUserID(req,conn);
			Boolean editResult=true;
			Boolean addResult=true;
			
			if(object.has("ID")){
				int id = object.getInt("ID");
				if(id==0){
					addResult = Insert(object, salerID, conn);
				}else{
					editResult = Uupdate(object, salerID,  conn);
				}
			}else{
				jObject = HttpUtil.getResponseJson(false, null, endDate.getTime() - beginDate.getTime(),
						"order receiver api doesn't have id",0,1,-1);
				writer.append(jObject.toString());
			}
			
			endDate=new Date();
			if(addResult&&editResult){
				jObject = HttpUtil.getResponseJson(true, null,
						endDate.getTime() - beginDate.getTime(), "success",0,1,-1);
				writer.append(jObject.toString());
			}else
			{
				jObject = HttpUtil.getResponseJson(false, null, endDate.getTime() - beginDate.getTime(),
						"Add or edit operation has error",0,1,-1);
				writer.append(jObject.toString());
			}
			writer.close();
			conn.close();
		} catch (SQLException |JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private String GenerateImageToServer(String imgStr)
	{
		UUID id = java.util.UUID.randomUUID();
		String path = getServletContext().getRealPath("/")+"\\UploadImg\\"+ id.toString()+ ".jpg";
		path = path.replace("\\desktop", "");
		String returnpath = "/UploadImg/"+ id.toString()+ ".jpg";
		GenerateImage(imgStr,path);
		return returnpath;
	}
	
	 public boolean GenerateImage(String imgStr, String imgFilePath) {// 对字节数组字符串进行Base64解码并生成图片
	        if (imgStr == null) // 图像数据为空
	            return false;
	        BASE64Decoder decoder = new BASE64Decoder();
	        try {
	            // Base64解码
	        	String info = imgStr.replaceAll("data:image/jpeg;base64,", "");
	            byte[] bytes = decoder.decodeBuffer(info);
	            for (int i = 0; i < bytes.length; ++i) {
	                if (bytes[i] < 0) {// 调整异常数据
	                    bytes[i] += 256;
	                }
	            }
	            // 生成jpeg图片
	            File file =  new File(imgFilePath);
	            if(!file.exists()){
	            	file.createNewFile();
	            }
	            OutputStream out = new FileOutputStream(imgFilePath);
	            out.write(bytes);
	            out.flush();
	            out.close();
	            return true;
	        } catch (Exception e) {
	            return false;
	        }
	    }
	 
	 
}
