/*모듈 sTask*/
var sTask = (function($){
    
    /*----비공개 공유변수및 함수----*/
    var start = 0;
    var list = 5;
    var doubleSubmitFlag = false;
    //var users = null;
    var usersTable = null;
    //var labelArray = [0, 0, 0, 0, 0, 0, 0];
    var labelArray = [['Task', 'Hours per Day'], ['이벤트', 0], ['기획전', 0], ['브랜드', 0], ['개선', 0], ['일반', 0], ['EDM', 0], ['기타', 0], ['배너 및 팝업', 0]];
    var partObg = {partA:0, partD:0, partP:0};
    var timeInterval;
    
    /*----비공개 생성자----*/
    function STask(){
        this.init();
    }

    /*----prototype----*/
    STask.prototype.init = function(){
        this.makeSelect();
        this.makeTask();
        this.eventBind();
    };

    /*처음로딩시*/
    STask.prototype.makeTask = function(){
        var that = this;
        that.run(function*(){
            var val = that.dateCheck()[0];
            var data = yield that.edit("data/ajax.php","POST",{val:val});
            yield new Promise(function(resolve, reject){
                that.makeUser(resolve);
            });
            that.makeTable(data);
            that.events();
            that.makeProgress(val);
        });
    };

    /*유저테이블*/
    STask.prototype.makeUser = function(resolve){
        var that = this;
        that.run(function*(){        
            that.usersState = yield that.edit("data/state/ajaxid.php","GET");

            /*
            var defaultsL = defaults.length;
            users = oriUsers.filter(function(val,idx){
                for(var i = 0;i < defaultsL;i++){
                    if(oriUsers[idx].name == defaults[i]){
                        return oriUsers[idx].name == defaults[i];
                    }     
                }          
            }); 
            */

            var oriUsers = yield that.edit("data/qdpm/ajaxid.php","GET");
            usersTable = oriUsers.reduce(function(acc,cur){
                if(cur.users_group_id == 2){
                    cur.users_group_id = "퍼블";
                }
                else if(cur.users_group_id == 4){
                    cur.users_group_id = "기획";
                }
                else{
                    cur.users_group_id = "디자인";
                }
                acc[cur.id] = {name:cur.name, group:cur.users_group_id, prep:0, prog:0, comp:0, time:0};
                return acc;
            },{});
            //console.log(that.usersState, 1);
            //console.log(users);
            //console.log(defaults); 
            //console.log(usersTable);

            resolve();
        });
    };

    /*테이블 생성 함수*/
    STask.prototype.makeTable = function(data){
        var dataT = data;
        var $table = $(".task-board tbody");
        var table = "";
        var tableN = "<tr><td colspan='7'>리스트가 없습니다.</td></tr>";
        
        table = this.tableEach(dataT,table);
        //console.log(dataT);
        if(dataT.length>0){
            $table.html(table);
        }
        else{
            $table.html(tableN);
        }
    };

    /*테이블 리스트 생성 함수*/
    STask.prototype.tableEach = function (dataT,table){
        $(dataT).each(function(index, item) {
            var cid = item.cid == "" ? "" : "["+item.cid+"]";                                               
            table +="<tr class="+'"'+item.state+'"'+"><td>" + item.date +"</td>" 
                + "<td class='chk'><a href='edit.php?id="+item.id+"'>" + item.catagory +"</a></td>"
                + "<td class='chk'>" + item.lang + "</td>" 	
                + "<td class='conts'><a class='chk' href='" + item.url + "'target='_blank'>"+cid+" "+item.name+"</a></td>"	 
                + "<td class='chk'>" + item.etc + "</td>"
                // + "<td class='file'>" + item.down + "</td>"  
                + "<td class='chk'>" + item.request + "</td>"			         
                + "<td class='chk'>" + item.cording + "</td></tr>";	                      
        }); 
        return table;
    }

    /*보고서 생성 함수*/
    STask.prototype.makeReport = function(data){
        var dataT = data;
        var $table = $(".report-board tbody");
        var table = "";
        var tableN = "<tr><td colspan='7'>리스트가 없습니다.</td></tr>";
        
        table = this.reportEach(dataT,table);
        //console.log(dataT);
        if(dataT.length>0){
            $table.html(table);
        }
        else{
            $table.html(tableN);
        }
    };

    /*보고서 리스트 생성 함수*/
    STask.prototype.reportEach = function (dataT,table){
        $(dataT).each(function(index, item) {
            var name = (item.catagory == "기타" || item.catagory == "개선") ? item.name +" ["+ item.etc +"]" : item.name;
            console.log(name);
            var cid = item.cid == "" ? "" : item.cid;                                               
            table +="<tr><td>" + item.catagory +"</td>" 
                + "<td>" + item.down + "</td>"
                + "<td>" + cid + "</td>" 	
                + "<td><p>" + name + "</p></td>"	 
                + "<td>" + item.lang + "</td>"
                + "<td>" + item.date + "</td>"			         
                + "<td>" + item.chdate + "</td></tr>";	                      
        }); 
        return table;
    }

    /*셀렉트 박스 생성 함수*/
    STask.prototype.makeSelect = function(){
        /*
        var listDate = [];
        listDate = (this.getDateRange('2017-12-21', this.dateCheck()[0], listDate)).reverse();
        var dataDate = listDate.map((value) => {
            var list = [];
            var mo = this.getInputDayLabel(value);
            list.push(value);
            list.push(mo);
            return list;
        });
        var option = "";
    
        $.each(dataDate,function(key, value){             
            //if(value[1]=="토" || value[1]=="일"){
                // return;
            // }
            // else{
                option +="<option value='"+value[0]+"'>"+value[0]+" ("+value[1]+")</option>";
            // }
        });
    
        $("#goList").append(option);
        */	
        $("#goList").datepicker({
            changeMonth:true,
            changeYear:true,
            showOn:"button",
            buttonImage:"https://www.shillaipark.com/estore/_ui/desktop/common/shilladfshome/kr/img/common/ico_calendar.png",
            buttonImageOnly:true,
            showMonthAfterYear:true,
            minDate:null,  //최소 기간
            maxDate:null,  //최대 노출
            yearRange:"c-5:c+5",  //노출되는 범위
            dateFormat :"yy-mm-dd",
            dayNamesMin:["일", "월", "화", "수", "목", "금", "토"],
            monthNamesShort: [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12" ],
        }); 
        $("#goList").datepicker("setDate", "today"); 
    };

    /*유저 리스트 생성 함수*/
    STask.prototype.makeArr = function(val){
        //console.log(this.usersState);
        var currentDate = new Date(val).toISOString().slice(0, 10);
        var arr = this.usersState.filter(function(val, idx){
            var input = new Date(val.input).toISOString().slice(0, 10);
            var output = (val.output == null || val.output == "null") ? null : new Date(val.output).toISOString().slice(0, 10);
            //console.log(currentDate, input, output);
            //console.log((currentDate >= input) && (output == null || currentDate <= output));
            return (currentDate >= input) && (output == null || currentDate <= output);
        }).map(function(val, idx){
            return val.name;
        });
        //console.log(currentDate, arr);

        return arr;
    };

    /*업무 진행 현황 생성 함수*/
    STask.prototype.makeProgress = function(val){
        var that = this;
        var status = {1:"준비",3:"진행",4:"다시작업",5:"작업종료",6:"대기"};
        var target = $(".day-process");
        var historyTableH = "";
        var resultTableH = "";
        var defaultsAr = that.makeArr(val);
        var historyTableB = null;
        var defaultsD = null;
        $("#pageloading").show();
        target.find(".result > table thead").children().remove();
        target.find(".history tbody").children().remove();
        target.find(".result > table tbody").children().remove();
        target.find(".result > table tfoot").children().remove();
        target.find("#charts").children().remove();
        target.find("#charts2").children().remove();
        target.find("#charts3").children().remove();
        target.find(".history .total").empty();
        target.find(".history .total-md").empty();
        that.run(function*(){
            var data = yield that.edit("data/qdpm/ajax.php","POST",{val:val,id:"none"});
            var dataC = yield that.edit("data/qdpm/ajaxCommend.php","POST",{val:val,id:"none"});
            var options = {
                'legend':{
                    names: defaultsAr,
                    hrefs: []
                        },
                'dataset':{
                    title:'Playing time per day', 
                    //values: [[0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0], [0,0,0]],
                    values: defaultsAr.map(function(val,idx){
                        return [0,0,0]  
                    }),
                    colorset: ['#30a1ce','#0072b2','transparent'],
                    fields:['시간','오버시간']
                    },
                'chartDiv' : 'charts',
                'chartType' : 'stacked_column',
                'chartSize' : {width:610, height:350},
                'maxValue' : 12,
                'increment' : 1
            };
            //console.log(data);
            //console.log(dataC);
            var totalTime = 0;
            var totalTimeM = 0;
            var dayProcess = [];
            for(let val in usersTable) {
                usersTable[val].prep=0;
                usersTable[val].prog=0;
                usersTable[val].comp=0;
                usersTable[val].time=0;
            }
            for(let val in partObg) {
                partObg[val] = 0;
            }
            if(data[0] || dataC[0]) {        
                for(let j = 0, len = data.length; j < len; j += 1){
                    let time = 0;
                    let timeM = 0;
                    let part = "";
                    let userP = "";
                    let dataClass = "normal";
                    if(data[j].tasks_status_id == 3){
                        dataClass = "progress";
                        let dataU = yield that.edit("data/qdpm/ajaxCommend.php","POST",{val:val,id:data[j].id});
                        //console.log(dataU);
                        if(dataU[0]){
                            for(let v = 0, len = dataU.length; v < len; v += 1){
                                //console.log(usersTable[dataU[v].created_by].time,dataU[v].worked_hours)
                                usersTable[dataU[v].created_by].time += Number(dataU[v].worked_hours);
                            }
                            part = usersTable[dataU[0].created_by].group;
                            userP = usersTable[dataU[0].created_by].name;
                            time = dataU.reduce(function(acc,cur){
                                return Number(acc) + Number(cur.worked_hours==null?0:cur.worked_hours);
                            },0);
                            timeM = Number(time)/8;
                            usersTable[dataU[0].created_by].prog++;
                            //usersTable[dataU[0].created_by].time += Number(time);
                        }
                        else{
                            let dataUl = yield that.edit("data/qdpm/ajaxCommend.php","POST",{val:"none",id:data[j].id});
                            //console.log(dataUl[0]);
                            if(dataUl[0]){
                                part = usersTable[dataUl[0].created_by].group;
                                userP = usersTable[dataUl[0].created_by].name;
                                usersTable[dataUl[0].created_by].prog++;
                            }
                            //console.log("no",dataUl);
                        } 
                        totalTime += Number(time); 
                        totalTimeM += Number(timeM); 
                        dataU = null;                  
                    }
                    /*
                    else if(data[j].tasks_status_id == 1){
                        let dataU = data[j].assigned_to.split(',');
                        dataU = dataU.map(function(val,idx){
                            usersTable[val].prep++;
                            return usersTable[val].name;
                        });
                        userP = dataU.join(',');
                        //console.log(dataU);
                        dataU = null;  
                    }
                    */
                    
                    
                    historyTableH += "<tr class='"+ dataClass +"'>"
                    + "<th scope='row'><span>»</span>"+ status[data[j].tasks_status_id] +"</th>"
                    + "<td>"+ part +"</td>"
                    + "<td>"+ userP +"</td>"
                    + "<td><a href='/qdPM_9.1/index.php/tasksComments?tasks_id="+ data[j].id +"&projects_id="+ data[j].projects_id +"'target='_blank'>"+ data[j].name +"</a></td>"
                    + "<td>"+ time +"</td>"
                    + "<td>"+ timeM +"</td>"
                    + "</tr>";         
                }
                for(let i = 0, len = dataC.length; i < len; i += 1){
                    let time = 0;
                    let timeM = 0;
                    let part = "";
                    let userP = "";
                    let dataU = yield that.edit("data/qdpm/ajax.php","POST",{val:val,id:dataC[i].tasks_id});
                    if(dataU[0].tasks_status_id != 3){
                        part = usersTable[dataC[i].created_by].group;
                        userP = usersTable[dataC[i].created_by].name;
                        time = dataC[i].worked_hours==null?0:dataC[i].worked_hours;
                        timeM = Number(time)/8;
                        usersTable[dataC[i].created_by].comp++;
                        usersTable[dataC[i].created_by].time += Number(time);

                        //console.log(userP);
                        /*
                        defaultsAr = [userP].reduce(function(a, b){
                            if (a.indexOf(b) < 0 ) a.push(b);
                            return a
                        }, defaultsAr);
                        */
                        
                        historyTableH += "<tr class='end'>"
                        + "<th scope='row'><span>-</span>종료</th>"
                        + "<td>"+ part +"</td>"
                        + "<td>"+ userP +"</td>"
                        + "<td><a href='/qdPM_9.1/index.php/tasksComments?tasks_id="+ dataU[0].id +"&projects_id="+ dataU[0].projects_id +"'target='_blank'>"+ dataU[0].name +"</a></td>"
                        + "<td>"+ time +"</td>"
                        + "<td>"+ timeM +"</td>"
                        + "</tr>"; 
                        
                        totalTime += Number(time);
                        totalTimeM += Number(timeM);
                    }

                    dayProcess.push(dataU[0]);
                    //console.log(dataU); 
                    dataU =null;
                }
                //console.log(defaultsAr);

                dataC.forEach(function(val, index){
                    var partString = usersTable[val.created_by].group;
                    if(partString == "기획"){
                        partObg.partA++;
                    }
                    else if(partString == "디자인"){
                        partObg.partD++;
                    }
                    else{
                        partObg.partP++;
                    }
                });
                //console.log(partObg);

                //console.log(dayProcess);
                dayProcess = dayProcess.filter(function(val, index, self){
                    return index === self.findIndex(function(t){
                        return t.id === val.id;
                    });
                });
                dayProcess.forEach(function(val, index){
                    if(val.tasks_label_id == 3){
                        labelArray[1][1]++;
                    }
                    else if(val.tasks_label_id == 2){
                        labelArray[2][1]++;
                    }
                    else if(val.tasks_label_id == 10){
                        labelArray[3][1]++;
                    }
                    else if(val.tasks_label_id == 5){
                        labelArray[4][1]++;
                    }
                    else if(val.tasks_label_id == 1){
                        labelArray[5][1]++;
                    }
                    else if(val.tasks_label_id == 8){
                        labelArray[6][1]++;
                    }
                    else if(val.tasks_label_id == 9){
                        labelArray[7][1]++;
                    }
                    else if(val.tasks_label_id == 11){
                        labelArray[8][1]++;
                    }
                });
                //console.log(dayProcess);

                //console.log(usersTable);
            }
            else{
                //console.log("noTable");
                historyTableH = "<tr><td colspan='6'>리스트가 없습니다.</td></tr>";
            }
            yield defaultsD = defaultsAr.reduce(function(acc,cur){
                for(let val in usersTable) {
                    if(cur == usersTable[val].name){
                        acc.push({name:usersTable[val].name,prep:usersTable[val].prep,prog:usersTable[val].prog,comp:usersTable[val].comp,time:usersTable[val].time});
                    }
                }       
                return acc;
            },[]);
            historyTableB = {
                prep:"<tr><th scope='row'>준비</th>",
                prog:"<tr><th scope='row'>진행</th>",
                comp:"<tr><th scope='row'>완료</th>",
                time:"<tr><th scope='row'>시간(hr)</th>",
                timM:"<tr><th scope='row'>M/D</th>"
            }
            for(let v = 0, len = defaultsD.length;v < len; v += 1){
                historyTableB.prep += "<td>" + defaultsD[v].prep + "</td>";
                historyTableB.prog += "<td>" + defaultsD[v].prog + "</td>";
                historyTableB.comp += "<td>" + defaultsD[v].comp + "</td>";
                historyTableB.time += "<td>" + defaultsD[v].time + "</td>";
                historyTableB.timM += "<td>" + defaultsD[v].time/8 + "</td>";
            }
            historyTableB.prep += "</tr>";
            historyTableB.prog += "</tr>";
            historyTableB.comp += "</tr>";
            historyTableB.time += "</tr>";
            historyTableB.timM += "</tr>";
            options['dataset'].values = defaultsD.map(function(val,idx){
                val.timeA = val.time;
                val.timeO = val.time > 8?(val.time-8)>4?4:val.time-8:0;
                val.time = val.time > 8?8:val.time;
                var arr = [val.time,val.timeO,val.timeA];
                //console.log(arr);
                return arr;
            });
            Nwagon.chart(options);

            resultTableH = defaultsAr.reduce(function(acc,cur){
                acc += "<th scope='col'>" + cur + "</th>";
                return acc;
            },resultTableH); 
            resultTableH = "<tr><th></th>" + resultTableH + "</tr>"; 
        

            //console.log(defaultsD);
            //console.log(historyTableB);

            target.find(".result > table thead").append(resultTableH);
            target.find(".history tbody").append(historyTableH);
            target.find(".history .total").text(totalTime);
            target.find(".history .total-md").text(totalTimeM);
            target.find(".result > table tbody").append(historyTableB.prog+historyTableB.comp);
            target.find(".result > table tfoot").append(historyTableB.time+historyTableB.timM);
            $("#pageloading").hide();
            //console.log(usersTable); 
        });
    };

    /*검색 테이블 생성 함수*/
    STask.prototype.searchTable = function(val){
        var that = this;

        that.run(function*(){ 
            var data = yield that.edit("data/select.php","POST",{val:val,start:start,list:list});    
            var $table = $(".task-board tbody");
            var table = "";
            var tableN = "<tr class='noResult'><td colspan='7'>검색결과가 없습니다.</td></tr>";
            $table.empty();
            //scCheck=false;
            if(data.length>0){
                table = that.tableEach(data,table);
                $table.append(table);
                start += list;
                //console.log(start,list);
            }
            else{
                clearInterval(timeInterval);
                $table.html(tableN);
            }

            that.textHighlight(val);
            timeInterval = setInterval((that.listCheck).bind(that),100);
        });
    };

    /*검색 더보기 테이블 생성 함수*/
    STask.prototype.moreTable = function(val){
        var that = this;

        that.run(function*(){ 
            var data = yield that.edit("data/select.php","POST",{val:val,start:start,list:list});
            var $table = $(".task-board tbody");
            var table = "";
            var tableN = "<tr class='sEnd'><td colspan='7'>검색 끝입니다.</td></tr>";
            if(data.length>0){
                table = that.tableEach(data,table);
                $table.append(table);
                start += list;
                // console.log(start,list);
            }
            else{
                $table.find(".sEnd").remove();
                clearInterval(timeInterval);
                if(!$table.find("tr").hasClass("noResult")){
                    $table.append(tableN);
                }                  
                // console.log("end");                  
            }
            that.textHighlight(val);
            doubleSubmitFlag = false; 
        });    
    };

    /*하이라이트*/
    STask.prototype.textHighlight = function(val){
        var search = val;
        var tg = $("#container .task-board");
        tg.find(".chk").each(function () {
            var highLight = $(this).find(".highLight").length;
            var tgL = $(this).text();
            var regex = new RegExp(search,'gi');
            var result = tgL.match(regex);
            var info = tgL.search(regex);
            if(highLight==0 && info!=-1){
                $(this).html( $(this).html().replace(regex, "<span class='highLight'>"+result[0]+"</span>") ); 
            }                         
        });
    };

    /*검색 테이블 widow 높이 체크 함수*/
    STask.prototype.listCheck = function(){
        var val = $("#search").val();
        var dh = $(document).height();
        var wh = $(window).height();
        var wt = $(window).scrollTop();
        var chClass = $(".task-board tr").hasClass("sEnd");
        if(dh==(wh+wt) && !chClass && val!="" && val!="검색어를 입력하세요."){
            this.moreTable(val);
            // console.log(start,list);
        } 
        else if(dh!=(wh+wt)){
            clearInterval(timeInterval);
            doubleSubmitFlag = false; 
            //console.log("ds")
        }
    };

    /*Promise*/
    STask.prototype.edit = function(url,type,data={}){
        return new Promise(function(resolve,reject){
            $.ajax({
                url:url,
                type:type, 
                dataType:"json", 
                data:data,
                success:function(data){
                    resolve(data);
                },
                error: function(error){
                    reject(error);
                }
            });
        });
    };

    /*Promise Runner*/
    STask.prototype.run = function(gen){
        var iter = gen();  
        (function iterate({value, done}) {
            if (done) {
                return value;
            }   
            if (value.constructor === Promise ) {
                value.then(data => iterate(iter.next(data)))
                .catch(err => iter.throw(err)); 
            } else {
                iterate(iter.next(value));
            }
        })(iter.next());
    };

    /*날짜 및 요일 반환 함수*/
    STask.prototype.dateCheck = function(target){
        //console.log(target);
        var data = [];
        var dt = target ? new Date(target) : new Date();
        var month = ""+(dt.getMonth()+1);
        var day = ""+dt.getDate();
        var year = dt.getFullYear();
        month = month.length < 2?'0' + month:month;
        day = day.length < 2?'0' + day:day;
        var dateVal = year + '-' + month + '-' + day;
        var week = ['일', '월', '화', '수', '목', '금', '토'];
        var today = dt.getDay(); 
        var todayLabel = week[today];
        data.push(dateVal);
        data.push(todayLabel);
        return data;
    };

    /*대상날짜 주, 시작일 마감일 반환*/
    STask.prototype.getWeek = function(target, start) {
        //Calcing the starting point 
        start = start || 0; 
        var today = new Date(target); 
        var day = today.getDay() - start; 
        var date = today.getDate() - day;
        var StartDate; 
        var EndDate;
            // Grabbing Start/End Dates 
        //console.log(date);
        if(date < 0){
            EndDate = this.dateCheck(new Date(today.setDate(date + 7)))[0]; 
            StartDate = this.dateCheck(new Date(today.setDate(date + 1)))[0];
        }
        else{
            StartDate = this.dateCheck(new Date(today.setDate(date + 1)))[0];
            EndDate = this.dateCheck(new Date(today.setDate(date + 7)))[0]; 
        }
        
        return [StartDate, EndDate]; 
    } 

    /*테이블 에이작스 이벤트 바인딩 함수*/
    STask.prototype.events = function(){
        var link = $(".langs-link nav");
        link.on("click","a",function(event){
            var target = $(this).text();
            var list = $("#container .task-board tbody tr");
            $(this).addClass("active").siblings().removeClass("active");
            if(target=="중문"){
                list.each(function(i,e){
                    var _ = $(this).find("td").text();
                    $(this).hide();
                    if(_.indexOf("중문")>=0){
                        $(this).show();
                    }
                });
                return false;
            }
            else if(target=="국문"){
                list.each(function(i,e){
                    var _ = $(this).find("td").text();
                    $(this).hide();
                    if(_.indexOf("국문")>=0){
                        $(this).show();
                    }
                });
                return false;
            }
            else if(target=="전체"){
                list.each(function(i,e){
                    $(this).show();
                });
                return false;
            }
        });
    };

    /*날짜 기간 반환 함수*/
    STask.prototype.getDateRange = function(startDate, endDate, listDate){
        var dateMove = new Date(startDate);
        var strDate = startDate;
        if (startDate == endDate){
            var strDate = dateMove.toISOString().slice(0,10);
            listDate.push(strDate);
        }
        else {
            while (strDate < endDate){
                var strDate = dateMove.toISOString().slice(0, 10);
                listDate.push(strDate);
                dateMove.setDate(dateMove.getDate() + 1);
            }
        }
        return listDate;
    };

    /*요일 반환 함수*/
    STask.prototype.getInputDayLabel = function(val) { 
        var today = null;
        var week = new Array('일', '월', '화', '수', '목', '금', '토'); 
        today = new Date(val).getDay(); 
        var todayLabel = week[today]; 
        return todayLabel; 
    };

    /*탑으로 함수*/
    STask.prototype.goTop = function(){
        var _tarGo = $(".bt-top");
        var scroll = $(window).scrollTop();
        if(scroll > 40) {
            _tarGo.fadeIn();
        } else {
            _tarGo.fadeOut();
        }
    };

    /*flag처리함수*/
    STask.prototype.doubleSubmitCheck = function(){
        if(doubleSubmitFlag){
            return doubleSubmitFlag;
        }else{
            doubleSubmitFlag = true;
            return false;
        }
    };

    /*레이어팝업 계산*/
    STask.prototype.layer = {
		scrollTop: 0,
		calculate: function(layer){
			var layer = $("." + layer),
				layerIn = layer.find(".pop_inner"),
				winH = $(window).height(),
				winW = $(window).width();
				layerIn.find(".pop_scroll").removeAttr("style");

			var layerH = layer.height(),
				layerW = layer.width(),
				marginH = parseInt(layerIn.css("marginTop")) + parseInt(layerIn.css("marginBottom"));
			//console.log(layer, winH, winW, layerH, layerW, marginH);
			
			if(winH < layerH){
				layerIn.find(".pop_scroll").css({
					height: winH - marginH,
					overflow: "auto",
				});
				layer.css({
					top: 0,
					left: (winW - layerW) / 2,
				});
			}
			else{
				layerIn.find(".pop_scroll").removeAttr("style");
				layer.css({
					top: (winH - layerH) / 2,
					left: (winW - layerW) / 2,
				});
			}

		},
		open: function(target, dimmed, parent, callback){
			var that = this;
			$(document).on("click", target, function(e){
                var layer = $(this).data("layer");
                var targetDom = $(this);
				that.scrollTop = $(window).scrollTop();

				if(callback){
					callback(show, layer, targetDom);
				}
				else{
					show();
				}
				
				function show(){
					$("body").addClass("fixed");
				
					if(dimmed) $(dimmed).fadeIn();
					$(parent + "." + layer).show();
					that.calculate(layer);
					//console.log(layer, that.scrollTop);

					$(window).on("resize.layer", function(){
						that.calculate(layer);
					});
				}

				e.preventDefault();
			});
		},
		close: function(target, dimmed, parent, callback){
			var that = this;
			$(document).on("click", target, function(e){
                var layer;
                var targetDom = $(this);
				if(target == dimmed){
					layer = $(parent);
					//console.log("dimmed");
				}
				else{
					layer = $(parent + "."+$(this).data("layer"));
				}
				
				if(callback){
					callback(hide, layer, targetDom);
				}
				else{
					hide();
				}

				function hide() {
					layer.hide();
					$("body").removeClass("fixed");
					$(window).scrollTop(that.scrollTop);
					if(dimmed) $(dimmed).fadeOut();
					//console.log(layer, that.scrollTop);

					$(window).off("resize.layer");
				}

				e.preventDefault();
			});
        },
    };

    /*이벤트 바인드*/
    STask.prototype.eventBind = function(){
        var that = this;
        var check = $(".toggle-switch  input[type='checkbox']");
        $(".datepicker_area").on("click", function(e){
            $(this).find(".ui-datepicker-trigger").click();
            return false;
        });
        $("#goList").on("change",function(){ 
            var val = $(this).val();
            //labelArray = [0, 0, 0, 0, 0, 0, 0];
            labelArray = [['Task', 'Hours per Day'], ['이벤트', 0], ['기획전', 0], ['브랜드', 0], ['개선', 0], ['일반', 0], ['EDM', 0], ['기타', 0], ['배너 및 팝업', 0]];
            that.run(function*(){
                var runVal = yield val;
                var todayVal = that.dateCheck()[0];
                var data = [];
                //console.log(runVal > todayVal);
                $(".task-board tbody").empty();
                $(window).off("scroll.more");
                if(runVal <= todayVal){
                    data = yield that.edit("data/ajaxC.php","POST",{val:runVal});
                } 
                that.makeTable(data);
                that.makeProgress(runVal);
                //console.log(data);
                $(".graph-tab-btn li").eq(0).addClass("active").siblings().removeClass("active");
                $(".graph-tab-btn li").attr("data-view","false");
                $(".charts-wrap > div").eq(0).show().siblings().hide();
            });  
        });

        $(".graph-tab-btn li").on("click",function(e){
            var idx = $(this).index();
            var targets = $(".charts-wrap > div");
            $(this).addClass("active").siblings().removeClass("active");
            if(idx == 1 && $(this).attr("data-view") == "false"){
                var val = $("#goList").val();
                var monthY = val.slice(0,-3);
                var day = Number(val.substring(8,10));
                var arr = [];
                var dayArr = [];
                for(let i = 0, len = day; i < len; i += 1 ){
                    arr[i] = [0,0];
                    dayArr[i] = (i+1);
                }
                
                //console.log(day,month,arr,dayArr);

                var options = {
                    'legend':{
                        names: dayArr
                            },
                    'dataset':{
                        title:'Playing time per day', 
                        values: arr,
                        colorset: ['#FF8C00', '#DC143C'],
                        fields:['진행', '완료'],
                        dataXY:['건', '일']
                    },
                    'chartDiv' : 'charts2',
                    'chartType' : 'line',
                    'chartSize' : {width:610, height:350},
                    'leftOffsetValue': 50,
                    'bottomOffsetValue': 60,
                    'minValue' :0,
                    'maxValue' : 40,
                    'increment' : 5//,
                    //'isGuideLineNeeded' : true //default set to false
                };

                that.run(function*(){
                    $("#pageloading").show();
                    var data = yield that.edit("data/qdpm/ajaxMonth.php","POST",{val:val, month:monthY});
                    //console.log(data);
                    data.forEach(function(vals,idx){
                        var days = parseInt(vals.created_at.substring(8,10),10)-1;
                        options['dataset'].values[days][1]++;
                        //console.log(days)
                    });

                    var dataP = yield that.edit("data/qdpm/ajax.php","POST",{val:val,id:"none"});
                    //console.log(dataP);
                    var valL = parseInt(val.substring(8,10),10);
                    var valM = val.substring(0,7);
                    dataP.forEach(function(vals,idx){
                        var valDataM = vals.start_date.substring(0,7);
                        var days = 0;
                        if(!(valDataM < valM)){
                            days = parseInt(vals.start_date.substring(8,10),10)-1;
                        }
                        for(var i = days;i < valL;i += 1){
                            options['dataset'].values[i][0]++;
                        }
                        //console.log(days,valL);
                    });


                    Nwagon.chart(options);

                    $("#pageloading").hide();
                });
                $(this).attr("data-view","true");             
            }
            else if(idx == 2 && $(this).attr("data-view") == "false"){
                /*
                var optionsD = {
                    'dataset': {
                        title: 'Web accessibility status',
                        values:labelArray,
                        colorset: ['#DC143C', '#FF8C00', '#56b4e9', '#0072b2', '#cc79a7', '#009e73', '#e69f00'],
                        fields: ['이벤트', '기획전', '브랜드', '개선', '일반', 'EDM', '기타'] 
                    },
                    'donut_width' : 100, 
                    'core_circle_radius':0,
                    'chartDiv': 'charts3',
                    'chartType': 'pie',
                    'chartSize': {width:610, height:300}
                };

                Nwagon.chart(optionsD);
                */
                that.run(function*(){
                    $("#charts3").css({height:"350px"});
                    $("#pageloading").show();
                    yield google.charts.load("current", {packages:["corechart"]});
                    yield google.charts.setOnLoadCallback(drawChart);
                    function drawChart() {
                        //console.log(labelArray);
                        var data = google.visualization.arrayToDataTable(labelArray);
                
                        var options = {
                            //title: '코드별 건수',
                            fontSize:13,
                            is3D: true,
                            tooltip:{showColorCode:true,isHtml:true,ignoreBounds:true},
                            chartArea:{left:'10%',top:0,width:'70%',height:'70%'},
                            pieSliceText:"label",
                            //legend:{position: 'top'},
                        };
                        var chart = new google.visualization.PieChart(document.getElementById('charts3'));
                        chart.draw(data, options);
                        google.visualization.events.addListener(chart, 'onmouseover', selectHandler);
                        function selectHandler(e) {
                            var widtarg = $(".google-visualization-tooltip");
                            var widtargW = $(".google-visualization-tooltip").width();
                            var targ = $(".google-visualization-tooltip-item").eq(1).find("span");
                            var text = targ.text().trim().split(" ");
                            var tags = "<span class='tool-text01'>" + text[0] + "</span><span class='tool-text02'> = " + text[1] + "</span>"
                            widtarg.width(widtargW+22)
                            targ.empty().append(tags);
                            //console.log(widtargW);
                        }
                        //console.log(chart.getImageURI());
                    }
                    //console.log(labelArray);
                    $("#charts3").css({height:"auto"});
                    $("#charts3").append("<ul class='category-pattern'>"
                                        +   "<li>"+ labelArray[1][0] + (labelArray[1][1]?"("+ labelArray[1][1]+")":"") +"</li>"
                                        +   "<li>"+ labelArray[2][0] + (labelArray[2][1]?"("+ labelArray[2][1]+")":"") +"</li>"
                                        +   "<li>"+ labelArray[3][0] + (labelArray[3][1]?"("+ labelArray[3][1]+")":"") +"</li>"
                                        +   "<li>"+ labelArray[4][0] + (labelArray[4][1]?"("+ labelArray[4][1]+")":"") +"</li>"
                                        +   "<li>"+ labelArray[5][0] + (labelArray[5][1]?"("+ labelArray[5][1]+")":"") +"</li>"
                                        +   "<li>"+ labelArray[6][0] + (labelArray[6][1]?"("+ labelArray[6][1]+")":"") +"</li>"
                                        +   "<li>"+ labelArray[7][0] + (labelArray[7][1]?"("+ labelArray[7][1]+")":"") +"</li>"
                                        +   "<li>"+ labelArray[8][0] + (labelArray[8][1]?"("+ labelArray[8][1]+")":"") +"</li>"
                                        +"</ul>");
                    $("#charts3").append("<table cellpadding='0'cellspacing='0'class='charts3-board'>"
                                            + "<caption>< 파트별 업무건수 ></caption>"
                                            + "<colgroup>"
                                            +    "<col width='' />"
                                            +    "<col width='' />"
                                            +    "<col width='16%' />"
                                            +    "<col width='' />"
                                            +    "<col width='' />"
                                            +    "<col width='' />"
                                            +    "<col width='' />"
                                            +    "<col width='' />"
                                            +"</colgroup>"
                                            +"<tbody>"
                                            +    "<tr>"
                                            +        "<th>기획</th>"
                                            +        "<td>"+ partObg.partA +"</td>"
                                            +        "<th>디자인</th>"
                                            +        "<td>"+ partObg.partD +"</td>"
                                            +        "<th>퍼블</th>"
                                            +        "<td>"+ partObg.partP +"</td>"
                                            +        "<th>토탈</th>"
                                            +        "<td>"+ (+partObg.partA+partObg.partD+partObg.partP) +"</td>"
                                            +    "</tr>"
                                            +"</tbody>"
                                        +"</table>"
                    );
                    $("#pageloading").hide(); 
                });

                

                $(this).attr("data-view","true");  
            }
            targets.eq(idx).show().siblings().hide();
        });

        $(".search-bt").on("click.search",function(){
            if(that.doubleSubmitCheck()) return;
            clearInterval(timeInterval);
            var val = $.trim($("#search").val());
            var offDiv = $(".day-tasks").offset().top;
            //console.log(offDiv);
            start = 0;
            list = 5;
            $(window).off("scroll.more");
            $(window).on("scroll.more",function(){
                var val = $("#search").val();
                var dh = $(document).height();
                var wh = $(window).height();
                var wt = $(window).scrollTop();
                var chClass = $(".task-board tr").hasClass("sEnd");
                if(dh==(wh+wt) && !chClass && val!="" && val!="검색어를 입력하세요." && wt > 40){
                    that.moreTable(val);
                }              
            });
            if(val!="" && val!="검색어를 입력하세요."){
                $("html, body").stop(true,true);
                that.searchTable(val); 
                $("html, body").animate({scrollTop:offDiv}/*,
                {start:function(){
                    $(window).off("scroll.top");
                    that.goTop();
                },always:function(){
                    $(window).on("scroll.top",function(){
                        that.goTop();
                    });
                }}*/,500);
            }
            else{
                alert("검색어를 입력하세요.");
                doubleSubmitFlag = false; 
            }
        });

        $("#search").on("keypress",function(e){
            if (e.which == 13){
                $('.search-bt').trigger('click.search');
            }
        });
    
        $(".bt-top").on("click",function(){
            $("html, body").animate({scrollTop:0},500);
        });
        
        that.layer.open(".layer_open_bt", ".layer_dimmed", ".pop_layer", function(show){
            that.run(function*(){
                var range = that.getWeek($("#goList").val());
                var data = yield that.edit("data/report.php","POST",{start:range[0], end:range[1]});
                console.log(range);
                $(".day-report > p").text(range[0] +" ~ "+ range[1]);
                that.makeReport(data);


                show();
            });
            
        });
        that.layer.close(".layer_close_bt", ".layer_dimmed", ".pop_layer", function(hide){
            hide();
            $(".report-board tbody").empty();
        });
        that.layer.close(".layer_dimmed", ".layer_dimmed", ".pop_layer");

        $(window).on("scroll.top",function(){
            that.goTop();
        });
        
        /*인풋 플레이스홀더*/
        $(".inputE").each(function(){
            var value = $(this).val();
            var type = $(this).attr("type");
            var check = $(this).hasClass("password");
            var current = value;
            $(this).on("focus",function(){
                value = $(this).val();
                if(check)$(this).attr("type","password");
                if(value==current)value='';$(this).val(value);
            }).on("blur",function(){
                value = $(this).val();
                if($(this).attr("type")=="password" && value=="")$(this).attr("type","text");
                if(value==''){$(this).val(current);}
                else{$(this).val(value);}
            });
        });

        check.on("click",function(){
            $(".toggle-switch p").toggle();
            if($(".toggle-switch .on").is(":visible")){
                $(".process-cont").slideDown();
                check.attr("checked",true);
                window.sessionStorage.setItem("chk", "on");
            }
            else{
                $(".process-cont").slideUp(); 
                check.attr("checked",false);
                window.sessionStorage.setItem("chk", "off");
            }
        });

    };

    return STask;

})(jQuery);



$(function(){
    /*호스트 실행문*/
    var sTaskIns = new sTask();
    
    $(window).on("load",function(){
        var chk = window.sessionStorage.getItem("chk");
        if(chk){
            if(chk == "on"){
                $(".process-cont").show();
            }
            else if(chk == "off"){
                $(".process-cont").hide();
                $(".toggle-switch .off").show();
                $(".toggle-switch .on").hide();
                $(".toggle-switch  input[type='checkbox']").attr("checked",false);
            }
        }
    });
});