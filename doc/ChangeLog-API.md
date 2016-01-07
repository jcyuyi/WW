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
如果查询结果为空则返回空JSON数组对象[]
返回结果按照更新时间排序，优先返回最新的记录

更新剧集：
成功更新返回 200 OK ，而不是201

删除剧集：
要删除的剧集不存在也返回204 NO CONTENT
参考 [Deleting a resource using http DELETE](http://stackoverflow.com/questions/6439416/deleting-a-resource-using-http-delete)

Change 12.24
-----
取消userid字段，全部使用username代替

查询剧集:
默认返回有限条结果
如果指定createdBy则返回所有该用户的公开条目
