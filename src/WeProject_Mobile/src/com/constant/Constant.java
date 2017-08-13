package com.constant;

//import org.hibernate.sql.Update;

public final class Constant {
	public static final String SQL_SELECT_USER = "SELECT ID, UserName, UserTypeID, CreateTime, LastLoginTime"
			+ " FROM sys_conf_userinfo "
			+ " WHERE UserName = ? AND Password = ? ";
	public static final String SQL_SELECT_USERIDBYNAME = "SELECT ID"
			+ " FROM sys_conf_userinfo "
			+ " WHERE UserName = ? ";
	public static final String SQL_SELECT_USERTypeId = "SELECT UserTypeID"
			+ " FROM sys_conf_userinfo "
			+ " WHERE UserName = ? ";
	public static final String SQL_ADD_USER="INSERT INTO sys_conf_userinfo (UserName,UserTypeID,"
			+ "Password, RealName, Tel, Address, CreateTime, LastLoginTime) VALUES (?,?,?,?,?,?,?,?)";
	//UPDATE Person SET Address = 'Zhongshan 23', City = 'Nanjing'
	public static final String SQL_UPDATE_USER="UPDATE sys_conf_userinfo "
			+ "SET Password = ?, RealName = ?, Tel = ?, Address = ? "
			+ "WHERE UserName = ?";
	public static final String SQL_DELETE_USER="DELETE FROM sys_conf_userinfo "
			+ "WHERE UserName = ?";
	public static final String SQL_GET_USERS="SELECT ID, Password, UserName, UserTypeID, CreateTime, "
			+ "LastLoginTime, RealName, Tel, Address, AliveUser, UpperID"
			+ " FROM sys_conf_userinfo "
			;
	public static final String SQL_RESET_PASSWORD="UPDATE sys_conf_userinfo "
			+ "SET Password = ?"
			+ "WHERE UserName = ?";
			
	public static final String SQL_GET_USERTOTALCOUNT="SELECT COUNT(ID) as total, ID"
			+ " FROM sys_conf_userinfo ";
	public static final String SQL_UPDATE_USERLOGINTIME = "UPDATE sys_conf_userinfo "
			+ "SET LastLoginTime = ? "
			+ "WHERE UserName = ?";
	public static final String SQL_GET_OnlineSALESINFOCOUNT="SELECT COUNT(ID) as total, ID"
			+ " FROM data_saleproducts "
			+ " WHERE Online = 1";
	public static final String SQL_GET_OnlineSALESINFOBYPAGE="SELECT * "
			+ " FROM data_saleproducts "
			+ " WHERE Online = 1"
			+ " ORDER BY ID LIMIT ?,?";
	public static final String SQL_GET_OnlineSALESINFOBYID="SELECT * "
			+ " FROM data_saleproducts "
			+ " WHERE Online = 1 and ID=?";
	
	public static final String LastLogInTimeColumn="LastLoginTime";
	public static final String SQL_CHECK_PRODUCTEXIST = "SELECT ID"
			+ " FROM data_storage_products "
			+ " WHERE Name = ? ";
	
	// Orders from Users
	public static final String SQL_INSERT_CART="INSERT INTO data_cart (SystemUserID,ReceiverName,"
			+ "ReceiverTel, ReceiverAddr, TotalCount,TotalPrice, PostNum, PassAudit) VALUES (?,?,?,?,?,?,?,1)";
	public static final String SQL_UPDATETOTALPRICE_CART= "UPDATE data_cart "
			+ "SET TotalCount = ?, TotalPrice = ? "
			+ "WHERE CartID = ?";
	public static final String SQL_Get_AUTOID="select @@identity";
	public static final String SQL_GET_SALESPRODUCTPRICEANDPRODUCTID="SELECT Price, ProductID"
			+ " FROM data_saleproducts "
			+ " WHERE ID = ?";
	public static final String SQL_INSERT_ORDER="INSERT INTO data_orders (CartID,SaleProductID,Price,"
			+ "Amount,LogTime) VALUES (?,?,?,?,?)";
	public static final String SQL_UPDATE_REDUCESTORAGEAMOUNT ="UPDATE data_storage_products "
			+ "SET CurrentAmount=CurrentAmount-?, SoldAmount= SoldAmount+? "
			+ "WHERE ID = ?";
	// End Orders from Users
	
	public static final String LOGIN_ERROR = "User name or password is wrong.";
	public static final String USERNAME_ERROR = "User name is occupied.";
	public static final String DATEBASEEMPTY_ERROR = "Database is empty.";
	public static final String DATEBASE_ERROR = "SQL operation has something wrong.";
	public static final String COMMON_ERROR = "Don't have the right permissions!";
	public static final String ERROR_WRONGPARAM = "Parameter wrong!";
	public static final String FORMAT_ERROR = "Format is not correct.";
	public static final String PASSWORD_ERROR = "Password is not correct.";
	
	// public 
	public static final String SQL_SELECT_USER_LIST = "SELECT ID, UserName FROM data_user";
	
	
	
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
	
	public static final int User_Management=0;
	public static final int Product_Management=1;
	public static final int Finance_Management=2;
	public static final int Storage_Management=3;
	
	
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
