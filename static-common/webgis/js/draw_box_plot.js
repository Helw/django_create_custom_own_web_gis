function fillboxplot(y,st,ye){


            //console.log(y)

            if (y < st) {

                return "white";

            }

            else if ((y >= ye) && (ye > 0)) {

                return "#CAC8C8";
            }

            else {

                return "#6A6868";
            }
    }

    function start_end_line(y,st,ye){


            if (y == addbeginyear){

                return "black";

            }

            if (y == st) {

                return "red";

            }

            else if (y == ye) {

                return "green";
            }

            else {

                return "#eee";
            }
    }

    function create_title_box(data){


            return "Min: "+data.min + " Q1: "+data.lq+ " Median: "+data.median+" Q3: "+data.uq+" Max: "+data.max;


    }


    function draw_chart(startyear, endyear, year,mn,q1,med,q3,mx){

                            var experiments = []
                            years = [parseInt(year[0]) -1]
                            for (var i=0;i<year.length;i++)
                                        {
                                                experiments.push({
                                                    id:year[i],
                                                    median:parseInt(med[i]),
                                                    uq:parseInt(q3[i]),
                                                    lq:parseInt(q1[i]),
                                                    max:parseInt(mx[i]),
                                                    min:parseInt(mn[i])
                                                })
                                                years.push(year[i])

                                        }
                            years.push(parseInt(experiments[experiments.length - 1].id)+1)

                            addbeginyear = parseInt(experiments[0].id)-1;
                            addendyear = parseInt(experiments[experiments.length - 1].id) + 1



                            var w = 400,
                                h = 200,
                                //x = pv.Scale.linear((parseInt(experiments[0].id)-1),(parseInt(experiments[experiments.length - 1].id)+1)).range(0, w)
                                x = pv.Scale.linear(addbeginyear, addendyear).range(0, w)
                                y = pv.Scale.linear(-80, 80).range(0, h)
                                s = 9 /* measure in px */



                            /* Build Panel */

                            var vis = new pv.Panel()
                                .width(w)
                                .height(h)
                                .margin(50);

                            /* Y label */

                            vis.add(pv.Label)
                                .data(["NDVI [%]"])
                                .left(-25)
                                .top(h / 2)
                                .textAlign("center")
                                .textAngle(-Math.PI / 2)
                                .font("bold 11px sans-serif");


                            /* X label */


                            vis.add(pv.Label)
                                    .left(200)
                                    .bottom(-30)
                                    .textAlign("center")
                                    .text("Year")
                                    .font("bold 11px sans-serif");


                             /* Add the x-axis rules*/

                              vis.add(pv.Rule)
                                .data(years) /*this function ticks() get all x values as array */
                                .left(x)
                                .strokeStyle(function(d) {return start_end_line(d,startyear, endyear)})
                                .lineWidth(1);




                            /* Add the y-axis rules */
                            vis.add(pv.Rule)
                                .data(y.ticks())
                                .bottom(y)
                                .strokeStyle(function(d) {return d  == -80 ? "black" : "#eee"})
                                 .anchor("left").add(pv.Label)
                                .text(y.tickFormat);




                            /* Add a panel for each data point */
                            var points = vis.add(pv.Panel)

                                .data(experiments)
                                .left(function(d) {return x(d.id) - s})
                                .width(s * 2);     /* width of box plot */



                            /* Add the years  label*/
                            points.anchor("bottom").add(pv.Label)
                                .textBaseline("top")
                                .text(function(d) {return d.id})



                            /* Add the range line */
                            points.add(pv.Rule)
                                .left(s)
                                .bottom(function(d) {return y(d.min)})
                                .height(function(d) {return y(d.max) - y(d.min)});



                            /* Add the min and max indicators */
                            points.add(pv.Rule)
                                .data(function(d) {return [d.min, d.max]})
                                .bottom(y)
                                .left(s/2)
                                .width(s);


                            /* Add the upper/lower quartile ranges */

                            points.add(pv.Bar)
                                .cursor("pointer")
                                .bottom(function(d) {return y(d.lq)})
                                .height(function(d) {return y(d.uq) - y(d.lq)})
                                //.fillStyle(function(d) {return fillboxplot(d.id ,startyear, endyear)})
                                .strokeStyle("black")
                                .lineWidth(1)
                                .antialias(false)
                                .def("fillStyle", function(d) {return fillboxplot(d.id ,startyear, endyear)})
                                .title(function(d) {return create_title_box(d)})
                                .event("mouseover", function() {return this.fillStyle("orange")})
                                .event("mouseout", function() {return this.fillStyle(undefined)})




                            /* Add the median line */
                            points.add(pv.Rule)
                                .bottom(function(d) {return y(d.median)})
                                .strokeStyle("black")
                                .lineWidth(2);



                            vis.render();


    }