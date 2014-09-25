$(function(){

    //DOM loaded
    $.getJSON( "/json/collections.json", function( data ) {
        //console.log(data);

        var members = data.members;

        function isString(o) {
            return typeof o == "string" || (typeof o == "object" && o.constructor === String);
        }

        function isNumber(o) {
            return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
        }

        function MembersModel() {
            var self = this;
            self.members = ko.observableArray(members);
            self.zipcodeFilter = ko.observable("");

            self.members.sort(function(left, right) { return left.name == right.name ? 0 : (left.name < right.name ? -1 : 1) })

            self.filteredMembers= ko.computed(function() {
                if(!self.zipcodeFilter()) {
                    return self.members(); //initial load when no zip filter is specified
                } else {
//                        console.log("Updating filtered!");
                    return ko.utils.arrayFilter(self.members(), function(member) {
                        var hasZip = false;
                        if (member.zipcodes) {
                            var zipStr = self.zipcodeFilter();
                            var matchZips = member.zipcodes.filter(function (zip) {
//                                    console.log("This zip: " + zip.toString() + ", to match: " + zipStr.toString());
                                var subStrIndex = zip.toString().indexOf(zipStr.toString());

                                if (subStrIndex == 0 && zip.toString().length >= zipStr.toString().length) {
//                                        console.log("Match");
                                    return true;
                                }

//                                    if (zip.toString() == zipStr.toString()) {
////                                        console.log("Match");
//                                        return true;
//                                    }
//                                    console.log("Fail");
                                return false;
                            });
//                                console.log("Num matches: " + matchZips.length.toString());
                            hasZip = matchZips.length > 0;
//                                console.log("Member with name: " + member.name + ", with zips: " + member.zipcodes.toString() + ", has zipcode: " + hasZip.toString()
//                                            + ", for zip: " + zipStr.toString() + ", with this many zips: " + member.zipcodes.length.toString());
                        }
                        return hasZip;
                    });
                }
            });

            self.enterZip = function(d,e) {
                self.zip();
                return true;
            }

            self.zip = function() {
                var zipVal = self.zipcodeFilter();
                var zipNum = 0;
                if (isString(zipVal)) {
                    if (zipVal == "") {
                        //self.zipcodeFilter(null);
                        return;
                    }
                    zipNum = parseFloat(zipVal);
                } else if (isNumber(zipVal)) {
                    zipNum = zipVal;
                } else {
                    zipNum = 0;
                }
//                    console.log("Got zip of: " + zipNum.toString());
                self.zipcodeFilter(zipNum);
            }
        }

        ko.applyBindings(new MembersModel());
    });


});