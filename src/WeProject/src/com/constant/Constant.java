package com.constant;

//import org.hibernate.sql.Update;

public final class Constant {
	public static final String SQL_SELECT_USER = "SELECT ID, UserName, UserTypeID, CreateTime, LastLoginTime"
			+ " FROM sys_conf_userinfo "
			+ " WHERE UserName = ? AND Password = ? ";
	public static final String SQL_SELECT_USERTypeId = "SELECT UserTypeID"
			+ " FROM sys_conf_userinfo "
			+ " WHERE UserName = ? ";
	
	public static final String LOGIN_ERROR = "User name or password is wrong.";
	public static final String COMMON_ERROR = "Don't have the right permissions!";
	public static final String ERROR_WRONGPARAM = "Parameter wrong!";
	
	// public 
	public static final String SQL_SELECT_USER_LIST = "SELECT ID, UserName FROM data_user";
	
	// Account function
	public static final String SQL_SELECT_CONDUMETYPE = "SELECT ID,Name_EN,Name_ZH,IsOut FROM enum_consumetype ORDER BY ID";
	public static final String SQL_SELECT_LOGDATA = "SELECT * from data_detailconsume WHERE Date = ? ";	
	public static final String SQL_SELECT_MONTHDETAIL = "SELECT * from data_detailconsume WHERE Date = ?";
	public static final String SQL_SELECT_ALLYEARS = "SELECT DISTINCT year FROM sta_yearbytype ";
	
	
	// Clothes function
	public static final String SQL_SELECT_SEASON = "SELECT * FROM enum_season";
	public static final String SQL_SELECT_COLOR = "SELECT * FROM enum_color";
	public static final String SQL_SELECT_MAINTYPE = "SELECT * FROM enum_clothestype";
	public static final String SQL_SELECT_SUBTYPE = "SELECT * FROM enum_clothessubtype";
	public static final String SQL_SELECT_SINGLEITEM = "SELECT ID,BuyTime,TypeID,Description,SubTypeID,ColorID,UserID,Link1,Link2,Link3,Value,SeasonID,`Where` FROM data_clothesdetail where ID = ?";
	
	// Medicine function
	public static final String SQL_SELECT_MEDICINETYPE = "SELECT * FROM enum_medicinetype";
	public static final String SQL_SELECT_MEDSINGLEITEM = "SELECT ID,`Name`,Production_Date,Expiration_Date,TypeID,Amount,`Left`,Unit,`Value`,`Usage`,Note,Link,Location_Buy as Location FROM data_medicnedetail where ID = ?";
	public static final String SQL_SELECT_MEDUPDATE = "Update data_medicnedetail set `left`=? where ID = ?";
	
	// Blogs function
	public static final String SQL_SELECT_BLOGLIST = "SELECT ID,UserID,Title,Date FROM data_blogs";
	public static final String SQL_SELECT_BLOGITEM = "SELECT * FROM data_blogs where ID= ?";
	
	// Gift function
	public static final String SQL_SELECT_GIFTLIST = "SELECT ID,Name,Value,IsIn,Date,Description FROM date_giftdetail";
	
	// AC function
	public static final String SQL_SELECT_ACLIST = "SELECT ID,Host,Account,Password,Combine,Answer FROM data_AClist";
	
	// schedule function
	public static final String SQL_SELECT_SCHEDULELIST = "SELECT Date,StartTime,EndTime,Title,`Where`,UserID,Description FROM data_schedule";
	
	// Role and Id
	public static final int Primary_Agency_Id = 5;
	public static final int Secondary_Agency_Id = 6;
	public static final int Super_Admin_Id = 7;
	public static final int Admin_Id = 1;
	public static final int Assistant_Id = 2;
	public static final int Accountant_Id = 3;
	public static final int Storekeeper_Id = 4;
	
	// Menu 完善/修改资料	登录/退出	分享	购买权限	查询运单号	收取提成	收取代理提成	记住购买人信息
	public static final String Loginlogout_Menu="LoginLogout";
	public static final String EditUserinfo_Menu="EditUserMenu";
	public static final String Share_Menu="Share";
	public static final String Buy_Menu="Buy";
	public static final String SearchTrackingNumber_Menu="SearchTrackingNumber";
	public static final String Commission_Menu="Commission";
	public static final String CommissionFromSecondary_Menu="CommissionFromSecondary";
	public static final String RememberBuyer_Menu="RememberBuyer";
	public static final String ManagerUser_Menu="ManagerUser";
	public static final String TakeOffTakeOnShelves_Menu="TakeOffTakeOnShelves";
	public static final String Finance_Menu="Finance";
	public static final String Storage_Menu="Storage";
	public static final String ShopOwner_Menu="ShopOwner";
	
	
//	select 
//	DAY as Date,
//max(case ID when 1 then VALUE else 0 end) '1',
//max(case ID when 2 then VALUE else 0 end) '2',
//max(case ID when 3 then VALUE else 0 end) '3',
//	max(case ID when 4 then VALUE else 0 end) '4'
//from 
//sta_daybytype 
//group by Date
	
	
//Update sta_daybytype
//
//DELETE FROM sta_daybytype WHERE DAY='2015-07-06';
//INSERT into sta_daybytype(Day,TypeID,value) 
//select * from ((SELECT t1.Date,t1.TypeID as type,SUM(t1.Value) as value FROM data_detailconsume t1 GROUP BY t1.TypeID ORDER BY t1.TypeID) t2) 

//Update sta_monthbytype
//
//DELETE FROM sta_monthbytype WHERE Month='2015-07-01';
//INSERT INTO sta_monthbytype(MONTH,TypeID,value) SELECT * FROM
//((SELECT '2015-07-01',TypeID,sum(value) as value from sta_daybytype WHERE day >= '2015-07-01' and day < '2015-08-01' GROUP BY TypeID) t2)

//Update sta_yearbytype
//
//DELETE FROM sta_yearbytype WHERE Year='2015-07-01';
//INSERT INTO sta_yearbytype(YEAR,TypeID,value) SELECT * FROM
//((SELECT '2015-01-01',TypeID,sum(value) as value from sta_monthbytype WHERE MONTH >= '2015-00-01' and MONTH < '2016-01-01' GROUP BY TypeID) t2)


}
