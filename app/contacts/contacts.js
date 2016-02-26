'use strict';

angular.module('myContacts.contacts', ['ngRoute', 'firebase'])

    .config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/contacts', {
                templateUrl: 'contacts/contacts.html',
                controller: 'ContactsCtrl'
            });
    }])

    // Contacts Controller
    .controller('ContactsCtrl', ['$scope', '$firebaseArray', function ($scope, $firebaseArray) {
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
            if ($scope.home_phone) { var home_phone = $scope.home_phone; } else { var home_phone = null; }
            if ($scope.work_phone) { var work_phone = $scope.work_phone; } else { var work_phone = null; }
            if ($scope.street_address) { var street_address = $scope.street_address; } else { var street_address = null; }
            if ($scope.city) { var city = $scope.city; } else { var city = null; }
            if ($scope.state) { var state = $scope.state; } else { var state = null; }
            if ($scope.zip) { var zip = $scope.zip; } else { var zip = null; }

            // Build Object

            $scope.contacts.$add({
                name : name ,
                email : email ,
                company : company,
                phones : [
                    {
                        mobile : mobile_phone,
                        home : home_phone,
                        work : work_phone
                    }
                ],
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
            });
        }

        // Show Edit form
        $scope.showEditForm = function (contact) {
            $scope.editFormShow = true;

            $scope.id = contact.$id;
            $scope.name = contact.name;
            $scope.email = contact.email;
            $scope.company = contact.company;
            $scope.mobile_phone = contact.phones[0].mobile;
            $scope.home_phone = contact.phones[0].home;
            $scope.work_phone = contact.phones[0].work;
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
            record.phones[0].work = $scope.work_phone;
            record.phones[0].home = $scope.home_phone;
            record.phones[0].mobile = $scope.mobile_phone;
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

            // Send Message
            $scope.message = "Contact updated";


        }

        // Delete Contact
        $scope.removeContact = function(contact){
            $scope.contacts.$remove(contact);
        }

        //Display Contacts
        $scope.showContact =function(contact){
            console.log('Displaying Contact...');

            $scope.name = contact.name;
            $scope.email = contact.email;
            $scope.company = contact.company;
            $scope.mobile_phone = contact.phones[0].mobile;
            $scope.home_phone = contact.phones[0].home;
            $scope.work_phone = contact.phones[0].work;
            $scope.street_address = contact.address[0].street_address;
            $scope.city = contact.address[0].city;
            $scope.state = contact.address[0].state;
            $scope.zip = contact.address[0].zip;

            $scope.contactShow = true ;
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