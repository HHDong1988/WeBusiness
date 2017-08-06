import java.io.IOException;
import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import com.util.HttpUtil;


public class LogoffSystem extends HttpServlet{
	private static final long serialVersionUID = 1L;
    
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LogoffSystem() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		Date beginDate = new Date();
		Date endDate = null;
		resp.setContentType("application/json; charset=utf-8");
		resp.setCharacterEncoding("UTF-8");
		
		PreparedStatement ps = null;
		ResultSet rs = null;
		PrintWriter writer = resp.getWriter();
		JSONObject jObject = null;
		
		
		Cookie[] cookies = req.getCookies();
		String username = null;
		if (cookies != null) {
			for (Cookie c : cookies) {
				if (c.getName().equals("username")) {
					username = c.getValue();
				}
			}
		}
		if(username != null){
			HttpSession session = req.getSession(true);
			session.removeAttribute(username);
		}
		
		Cookie cookieusername = new Cookie("username", null); 
		cookieusername.setMaxAge(0);
		resp.addCookie(cookieusername); 
		Cookie cookieuserType = new Cookie("UserTypeId", null); 
		cookieuserType.setMaxAge(0);
		resp.addCookie(cookieuserType); 
		Cookie cookietoken = new Cookie("token", null); 
		cookietoken.setMaxAge(0);
		resp.addCookie(cookietoken); 
		endDate = new Date();
		
		jObject = HttpUtil.getResponseJson(true, null,endDate.getTime() - beginDate.getTime(), null,0,1,-1);
		writer.append(jObject.toString());
		writer.close();
		
	}
}
