//before login 
//get public series
$.get('api_v1/series', {
    limit: 20
}, function(data, status) {
    alert(status);
    var temm = document.getElementById("publ").innerHTML;
    temm += "&nbsp;&nbsp;大家正在看：<br/>";
    for (var i = 0; i < data.length; i++) {
        temm += "&nbsp;&nbsp;&nbsp;&nbsp;剧集名称：" + data[i].name + "<br/>";
        temm += "&nbsp;&nbsp;&nbsp;&nbsp;当前进度：" + data[i].current + "<br/>";
        var nnote = data[i].note;
        if (nnote != "") {
            temm += "&nbsp;&nbsp;&nbsp;&nbsp;评论：" + data[i].note + "<br/>";
        }
        temm += "&nbsp;&nbsp;&nbsp;&nbsp;最近更新时间：" + data[i].updatedAt + "<br/><br/>";
    }
    temm += "<br/><br/>";
    document.getElementById("publ").innerHTML = temm;
});
