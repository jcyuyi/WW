WW API Change Log
====

Change 15.11.25
----

Change:
userId -> userid
INVALID REQUEST -> Bad Request
public -> isPublic 

'用户登录' Change url from '/login' to '/user' 


Change 15.12.21
----

查询剧集:
可附上用户的 sessionToken, 只 获取自己的追剧情况
如果此时sessionToken无效，返回 401 Unauthorized

也就是说，如果首页需要显示自己的追剧情况和所有人的追剧情况，则需要发送至少两个查询剧集请求