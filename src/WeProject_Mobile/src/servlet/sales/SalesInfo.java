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
public class SalesInfo extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	
	//get
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		// super.doGet(req, resp);
		JSONArray resultarray =null;
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
		int iPageNum =0; 
		if(req.getParameter("page")!=null){
			iPageNum= Integer.parseInt(req.getParameter("page").trim());
		}
			
		int iPagesize =0; 
		if(req.getParameter("pageSize")!=null){
			iPagesize = Integer.parseInt(req.getParameter("pageSize").trim());
		}
		int salesID=-1;
		if( req.getParameter("ID")!=null){
			salesID = Integer.parseInt(req.getParameter("ID").trim());
		}
		int total=0;
		
		
		try {
			conn = DBController.getConnection();
			if(salesID==-1){
				ps = conn.prepareStatement(Constant.SQL_GET_OnlineSALESINFOCOUNT);
				
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
					ps = conn.prepareStatement(Constant.SQL_GET_OnlineSALESINFOALL);
				}else{
					ps = conn.prepareStatement(Constant.SQL_GET_OnlineSALESINFOBYPAGE);
		        	ps.setInt(1, startPoint);
					ps.setInt(2, iPagesize);
				}
				
			}else{//sales id has value
				ps = conn.prepareStatement(Constant.SQL_GET_OnlineSALESINFOBYID);
	        	ps.setInt(1, salesID);
			}
			resultarray = DBController.getJsonArray(ps, conn);

			endDate = new Date();
			if(resultarray==null||(resultarray!=null&&resultarray.length()==0)){
				jObject = HttpUtil.getResponseJson(false, null,
						endDate.getTime() - beginDate.getTime(), Constant.DATEBASEEMPTY_ERROR,0,1,-1);
				writer.append(jObject.toString());
			}else
			{
				jObject = HttpUtil.getResponseJson(true, resultarray, endDate.getTime() - beginDate.getTime(), null,total,iPageNum,iPagesize);
				writer.append(jObject.toString());
			}

			writer.close();
			DBController.ReleaseConnection(conn);
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
		
	}
}
