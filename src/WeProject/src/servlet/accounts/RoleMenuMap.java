package servlet.accounts;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import com.constant.Constant;

import org.json.JSONObject;

public final class RoleMenuMap {
	
	private static HashMap<Integer, List<String>> rolemenumap;
	
	public static List<String> GetMenuList(Integer role){
		if(rolemenumap==null){
			InitMap();
		}
		if(rolemenumap.containsKey(role))
			return rolemenumap.get(role);
		return null;
		
		
	}
	
	private static void InitMap()
	{
		/*
		 * 一级分销	完善/修改资料	登录/退出	分享	购买权限	查询运单号	收取提成	收取代理提成	记住购买人信息
 			二级分销	完善/修改资料	登录/退出	分享	购买权限	查询运单号	收取提成		记住购买人信息
								
			超级管理员	完善/修改资料	登录/退出	管理用户					
			店面管理	完善/修改资料	登录/退出	上架/下家商品	不同模板				
			财务	完善/修改资料	登录/退出	对账/审批发货	按普通用户分组统计账单				
			仓库	完善/修改资料	登录/退出	打印发货地址	录入运单号	库存管理			
			店长（管理员）	完善/修改资料	登录/退出	数据统计					

		 * */
		List<String> primary_angency_menulist = Arrays.asList(Constant.EditUserinfo_Menu, Constant.Loginlogout_Menu,
				Constant.Share_Menu,Constant.Buy_Menu,Constant.SearchTrackingNumber_Menu,Constant.Commission_Menu,
				Constant.CommissionFromSecondary_Menu,Constant.RememberBuyer_Menu,Constant.Loginlogout_Menu);
		List<String> secondary_angency_menulist = Arrays.asList(Constant.EditUserinfo_Menu, Constant.Loginlogout_Menu,
				Constant.Share_Menu,Constant.Buy_Menu,Constant.SearchTrackingNumber_Menu,Constant.Commission_Menu,
				Constant.RememberBuyer_Menu,Constant.Loginlogout_Menu);
		List<String> super_admin_menulist = Arrays.asList(Constant.EditUserinfo_Menu, Constant.ManagerUser_Menu,Constant.Loginlogout_Menu);
		List<String> assistant_menulist = Arrays.asList(Constant.EditUserinfo_Menu, Constant.TakeOffTakeOnShelves_Menu, Constant.Loginlogout_Menu);
		List<String> accountant_menulist = Arrays.asList(Constant.EditUserinfo_Menu, Constant.Finance_Menu, Constant.Loginlogout_Menu);
		List<String> storekeeper_menulist = Arrays.asList(Constant.EditUserinfo_Menu, Constant.Storage_Menu, Constant.Loginlogout_Menu);
		List<String> admin_menulist = Arrays.asList(Constant.EditUserinfo_Menu, Constant.ShopOwner_Menu, Constant.Loginlogout_Menu);
		rolemenumap = new HashMap<Integer, List<String>>();
		rolemenumap.put(Constant.Primary_Agency_Id, primary_angency_menulist);
		rolemenumap.put(Constant.Secondary_Agency_Id, secondary_angency_menulist);
		rolemenumap.put(Constant.Super_Admin_Id, super_admin_menulist);
		rolemenumap.put(Constant.Assistant_Id, assistant_menulist);
		rolemenumap.put(Constant.Accountant_Id, accountant_menulist);
		rolemenumap.put(Constant.Storekeeper_Id, storekeeper_menulist);
		rolemenumap.put(Constant.Admin_Id, admin_menulist);
	}

}
