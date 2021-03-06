'use strict';

var mod = angular.module('myContacts.contacts', ['ngRoute', 'firebase','angular.chosen'])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/contacts', {
                templateUrl: 'contacts/contacts.html',
                controller: 'ContactsCtrl'
            })
            .when('/contact_form', {
                templateUrl: 'contacts/contact-form.html',
                controller: 'ContactFormCtrl'
            });
    }])

    // ContactFormCtrl Controller
    .controller('ContactFormCtrl', ['$scope', '$firebaseArray','$http', function ($scope, $firebaseArray,$http) {

        mod.directive('chosen',function(){
            var Linker = function(scope, element, attr){
                scope.$watch('skillList',function(){
                    element.trigger('liszt:updated');
                })
                element.chosen();
            };
            return {
                restrict : 'A',
                link:Linker
            }
        });

        $scope.url = 'contacts/skills.json';
        $scope.skillList = [];

        $scope.fetchList = function(){
            $http.get($scope.url).success(function (result) {
                $scope.skillList = result;
            });
        }
        $scope.fetchList();


        // Init Firebase
        var firebase_ref = new Firebase('https://aolakh-contacts.firebaseio.com/contacts');

        // get Contacts
        $scope.contacts = $firebaseArray(firebase_ref);

        // Show Add form
        $scope.showAddForm = function () {
            $scope.addFormShow = true;
        }

        // Hide Add form
        $scope.hideForm = function () {
            $scope.addFormShow = false;
            $scope.contactShow = false;
        }

        // Submit Add Contacts
        $scope.submitAddForm = function () {
            console.log('Adding Contact...');

            // Assign Values

            if ($scope.name) { var name = $scope.name; } else { var name = null; }
            if ($scope.email) { var email = $scope.email; } else { var email = null; }
            if ($scope.company) { var company = $scope.company; } else { var company = null; }
            if ($scope.mobile_phone) { var mobile_phone = $scope.mobile_phone; } else { var mobile_phone = null; }
            if ($scope.street_address) { var street_address = $scope.street_address; } else { var street_address = null; }
            if ($scope.city) { var city = $scope.city; } else { var city = null; }
            if ($scope.state) { var state = $scope.state; } else { var state = null; }
            if ($scope.zip) { var zip = $scope.zip; } else { var zip = null; }

            // Build Object

            $scope.contacts.$add({
                name : name ,
                email : email ,
                company : company,
                mobile_phone : mobile_phone,
                address : [
                    {
                        street_address : street_address,
                        city: city,
                        state: state,
                        zip:zip
                    }
                ]
            }).then(function(firebase_ref){
                var id = firebase_ref.key();
                console.log('Add contact with ID '+ id);

                //clear form
                clearFields();

                // Hide Form
                $scope.addFormShow = false;

                // Send Message
                $scope.message = "Contact added";

                setTimeout(function(){
                   $('.alert-box').fadeTo(500, 0).slideUp(400);
                }, 4000);
            });
        }



        // method to clear fields
        function clearFields(){
            console.log('Clearing Form Data');

            $scope.name="";
            $scope.email="";
            $scope.company="";
            $scope.mobile_phone="";
            $scope.home_phone="";
            $scope.work_phone="";
            $scope.street_address="";
            $scope.city="";
            $scope.state="";
            $scope.zip="";
        }
    }])

    // Contacts Controller
    .controller('ContactsCtrl', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
        // Init Firebase
        var firebase_ref = new Firebase('https://aolakh-contacts.firebaseio.com/contacts');

        // get Contacts
        $scope.contacts = $firebaseArray(firebase_ref);

        //Display Contacts
        $scope.showContact =function(contact){
            console.log('Displaying Contact...');

            $scope.name = contact.name;
            $scope.email = contact.email;
            $scope.company = contact.company;
            $scope.mobile_phone = contact.mobile_phone;
            $scope.street_address = contact.address[0].street_address;
            $scope.city = contact.address[0].city;
            $scope.state = contact.address[0].state;
            $scope.zip = contact.address[0].zip;

            $scope.contactShow = true ;
        }

        // Show Edit form
        $scope.showEditForm = function (contact) {
            $scope.editFormShow = true;

            $scope.id = contact.$id;
            $scope.name = contact.name;
            $scope.email = contact.email;
            $scope.company = contact.company;
            $scope.mobile_phone = contact.mobile_phone;
            $scope.street_address = contact.address[0].street_address;
            $scope.city = contact.address[0].city;
            $scope.state = contact.address[0].state;
            $scope.zip = contact.address[0].zip;
        }

        // Submit Edit Contacts
        $scope.submitEditForm = function(){
            console.log('Updating Contact...');

            // get ID
            var id = $scope.id;

            // get Record
            var record = $scope.contacts.$getRecord(id);

            // assign values

            record.name = $scope.name;
            record.email = $scope.email;
            record.company = $scope.company;
            record.mobile_phone = $scope.mobile_phone;
            record.address[0].street_address = $scope.street_address;
            record.address[0].city = $scope.city;
            record.address[0].state = $scope.state;
            record.address[0].zip = $scope.zip;

            //save values
            $scope.contacts.$save(record).then(function(firebase_ref){
                console.log(firebase_ref.key);
            });

            // clear all fields
            clearFields();

            // Hide Form
            $scope.editFormShow = false;
            
            // Hide Single contact show area
            $scope.contactShow = false;

            // Send Message
            $scope.message = "Contact updated";

            setTimeout(function(){
                $('.alert-box').fadeTo(500, 0).slideUp(400);
            }, 4000);


        }

        // Delete Contact
        $scope.removeContact = function(contact){
            $scope.contacts.$remove(contact);
        }

        // Hide Add form
        $scope.hideForm = function () {
            $scope.addFormShow = false;
            $scope.contactShow = false;
        }

        // method to clear fields
        function clearFields(){
            console.log('Clearing Form Data');

            $scope.name="";
            $scope.email="";
            $scope.company="";
            $scope.mobile_phone="";
            $scope.home_phone="";
            $scope.work_phone="";
            $scope.street_address="";
            $scope.city="";
            $scope.state="";
            $scope.zip="";
        }

    }]);
function getSkillList($scope,$http){
    $scope.url = 'contacts/skills.json';
    $scope.skillList = [];

    $scope.fetchList = function(){
        $http.get($scope.url).then(function (result) {
            $scope.skillList = result.data;
        });
    }
    $scope.fetchList();
}

