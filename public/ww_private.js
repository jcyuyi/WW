var token = "";
$(document).ready(function() {
    //login
    $("#login").click(function() {
        $.get('api_v1/user', {
            username: $('#usrname').val(),
            password: $('#password').val()
        }, function(data, status) {
            token = data.sessionToken;
            alert("登陆成功！" + token)
            $('#login_putin').hide();

            document.getElementById("me").innerHTML += "&nbsp;&nbsp;我正在看：<br/>";
            $.ajax({
                url: 'api_v1/series',
                type: 'get',
                headers: {
                    sessiontoken: token
                },
                success: function(data) {
                    alert(status);
                    var tem2 = document.getElementById("me").innerHTML;
                    for (var i = 0; i < data.length; i++) {
                        tem2 += "&nbsp;&nbsp;&nbsp;&nbsp;剧集名称：" + data[i].name + "<br/>";
                        tem2 += "&nbsp;&nbsp;&nbsp;&nbsp;剧集ID：" + data[i].seriesId + "<br/>";
                        tem2 += "&nbsp;&nbsp;&nbsp;&nbsp;当前进度：" + data[i].current + "/" + data[i].total + "<br/>";
                        var nnote = data[i].note;
                        if (nnote != "") {
                            tem2 += "&nbsp;&nbsp;&nbsp;&nbsp;评论：" + data[i].note + "<br/>";
                        }
                        tem2 += "&nbsp;&nbsp;&nbsp;&nbsp;最近更新时间：" + data[i].updatedAt + "<br/><br/>";
                    }
                    tem2 += "<br/><br/><br/>";
                    document.getElementById("me").innerHTML = tem2;
                }
            });


            document.getElementById("add").innerHTML += '<br/><br/>我要看新的剧：<input id="seriesname" type="text" ><br/>\
总集数：<input id="serieslength" type="text" ><br/>\
已经看到的集数：<input id="seriescurrent" type="text" ><br/>\
评论：<input id="notes" type="text" ><br/>\
<input id="newseries" type="submit" value="提交">\
<input id="newseries2" type="reset" value="重置">';


            $("#newseries2").click(function() {
                document.getElementById("seriesname").value = "";
                document.getElementById("serieslength").value = "";
                document.getElementById("seriescurrent").value = "";
                document.getElementById("notes").value = "";
            });

            $("#newseries").click(function() {
                var tmp1 = $("#seriesname").val();
                var tmp2 = $("#serieslength").val();
                var tmp3 = $("#seriescurrent").val();
                var tmp4 = $("#notes").val();
                $.ajax({
                    url: 'api_v1/series',
                    type: 'post',
                    headers: {
                        sessiontoken: token
                    },
                    data: {
                        name: tmp1,
                        total: tmp2,
                        current: tmp3,
                        note: tmp4,
                        isPublic: true
                    },
                    dataType: 'json',
                    success: function(data) {
                        alert("添加成功！");
                    }
                });
            });


            document.getElementById("update").innerHTML += '<br/><br/>我要更新剧集ID：<input id="seriesname1" type="text" ><br/>\
更新的集数：<input id="seriescurrent1" type="text" ><br/>\
<input id="updateseries" type="submit" value="提交">\
<input id="newseries3" type="reset" value="重置">';

            $("#newseries3").click(function() {
                document.getElementById("seriesname1").value = "";
                document.getElementById("seriescurrent1").value = "";
            });

            document.getElementById("update").innerHTML += '<br/><br/> <input id="logout" type="submit" value="登出">';
            $("#updateseries").click(function() {
                var tmp5 = $("#seriesname1").val();
                var tmp6 = $("#seriescurrent1").val();
                $.ajax({
                    type: "put",
                    url: "api_v1/series/" + tmp5,
                    headers: {
                        sessiontoken: token
                    },
                    data: {
                        current: tmp6
                    },
                    success: function(data, status) {
                        alert("更新成功！");
                    }
                });
            });
            $("#logout").click(function() {
                location.reload();
            });
        });
    });
    $("#regist").click(function() {
        $.post('api_v1/user', {
            username: $('#usrname').val(),
            password: $('#password').val()
        }, function(data, status) {
            alert("注册成功！请登录");
        });
    });

});
