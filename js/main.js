$(document).ready(function () {
            $('#generate').click(function () {
                var lines = [];
                lines = $('#input').val().split(/\n/);

                //raw data
                var rawData = [];

                if (($('#centerDiv').find("option").length - 1) !== lines.length) {
                    $("#centerDiv").text("Center: ");
                    var sel = $('<select>').attr('id', 'middle').appendTo('#centerDiv');
                    sel.append($("<option>").attr('value', 'auto').text('auto'));
                    for (var i = 0; i < lines.length; i++) {
                        sel.append($("<option>").attr('value', i).text(i + 1));
                    }
                }
                //structured data
                var data = [];

                // structuring raw data depending on option
                for (var i = 0; i < lines.length; i++) {
                    if (/\S/.test(lines[i])) {
                        rawData[i] = lines[i].trim().split(/,\s|\t/);
                        data.push([]);
						switch($('#format').val()) {
                        case "1":
                            data[i].push(rawData[i][0]);
                            data[i].push(rawData[i][1]);
                            break;
                        case "2":
                            data[i].push(rawData[i][1]);
                            data[i].push(rawData[i][2]);
                            data[i].push(rawData[i][0]);
                            break;
                        case "3":
                            data[i].push(rawData[i][1]);
                            data[i].push(rawData[i][0]);
                            break;
                        case "4":
                            data[i].push(rawData[i][2]);
                            data[i].push(rawData[i][1]);
                            data[i].push(rawData[i][0]);
                            break;
                        default:
                            break;
                        }
                    }
                }

                // array of a final query
                var output = [];

                var staticLink = "https://static-maps.yandex.ru/1.x/?";
                output.push(staticLink);

                //center and link
                var link;
                var center;
				if (data.length !== 1) {
                if ($('#middle').val() !== 'auto') {
                    center = "ll=" + data[$('#middle').val()][0] + "," + data[$('#middle').val()][1] + "&";
                    output.push(center);

                    link = "https://yandex.ru/maps/?ll=" + data[$('#middle').val()][0] + "%2C" + data[$('#middle').val()][1] + "&z=13";
                } else {
                    link = "https://yandex.ru/maps/?ll=" + data[0][0] + "%2C" + data[0][1] + "&z=13";
                }
				} else {
					link = "https://yandex.ru/maps/?ll=" + data[0][0] + "%2C" + data[0][1] + "&z=16&text=" + data[0][1] + "%2C%20" + data[0][0];
				}

                // type
                var type = "l=" + $('#type').val() + "&";
                output.push(type);

                //size
                var size;
                if (!$('#autoSize').is(":checked")) {
                    size = "size=" + $('#width').val() + "," + $('#height').val() + "&";
                    output.push(size);
                }

                //language
                var lang;
                lang = "lang=" + $('#language').val() + "&";
                output.push(lang);

                //scale
                var scale;
                // checking auto or not
                if ($('#scale').val() !== "18") {
                    scale = "z=" + $('#scale').val() + "&pt=";
                    output.push(scale);
                } else {
                    output.push("pt=");
                }

                //mark type + markSize
                var mark = $('#mark').val() + $('#markSize').val();
                $('#outDiv').append('<div id="preview" style="float: left;"></div>');
                $('#outDiv').append('<div id="outputDiv" style="float: left;"></div>');
                $('#outDiv').append('<div id="names" style="float: left; margin-left: 20px;"></div>');

                $('#names').empty();

                //make coordinates string from array
                var coordinates = []
                for (var i = 0; i < data.length; i++) {
                    coordinates.push(data[i][0]);
                    coordinates.push(",");
                    coordinates.push(data[i][1]);
                    coordinates.push("," + mark + (i + 1));

					switch($('#format').val()) {
                        case "2":
                            $('#names').append((i + 1) + ". " + data[i][2] + "<br>");
                            break;
                        case "4":
                            $('#names').append((i + 1) + ". " + data[i][2] + "<br>");
                            break;
                        default:
                            break;
                    }

                    if (i !== (data.length - 1)) {
                        coordinates.push("~");
                    }
                }

                //output string
                var outputString = output.join("");

                var coordinatesString = coordinates.join("");

                outputString += coordinatesString;

                $('#outputDiv').empty();
                $('#outputDiv').append("<div style=\"float: left;\"><textarea id='output'></textarea></div>");
                $('#output').val(outputString);
                $("#preview").html($("<img>").attr({src: outputString, id: 'mapImage'}));
                $('#mapImage').wrap(($('<a>')).attr({href: link, target: '_blank'}));
                $('<br><p><b>Link to yandex.maps:</b> ' + link + '</p>').appendTo('#preview');
            });


            $("#width").attr({
                "max": 650,
                "min": 50
            });
            $("#height").attr({
                "max": 450,
                "min": 50
            });
});
