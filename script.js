function addRecord() {
  var form_data = {
    user_code: $("#user_code").val(),
    first_name: $("#first_name").val(),
    middle_name: $("#middle_name").val(),
    last_name: $("#last_name").val(),
    phone_number: $("#phone_number").val(),
    phone_country_code: $("#phone_country_code").val(),
    email: $("#email").val(),
  };

  $.ajax({
    url: "https://glexas.com/hostel_data/API/raj/new_admission_insert.php",
    method: "POST",
    data: form_data,
    dataType: "json",
    success: function (response) {
      console.log("Record added successfully", response);
      refreshDataTable();

      // Reset form fields
      $("#user_code").val("");
      $("#first_name").val("");
      $("#middle_name").val("");
      $("#last_name").val("");
      $("#phone_number").val("");
      $("#phone_country_code").val("");
      $("#email").val("");
    },
    error: function (error) {
      console.error("Error adding record", error);
    },
  });
}

function deleteRecord(registration_main_id) {
  $.ajax({
    url: "https://glexas.com/hostel_data/API/raj/new_admission_delete.php",
    method: "POST",
    data: { registration_main_id: registration_main_id },
    dataType: "json",
    success: function (response) {
      console.log("Record deleted successfully", response);
      var table = $("#myTable").DataTable();
      table.row($(this).closest("tr")).remove().draw();
    },
    error: function (error) {
      console.error("Error deleting record", error);
    },
  });
}

var editing_registration_main_id;
function openEditModal(registration_main_id) {
  editing_registration_main_id = registration_main_id;

  $.ajax({
    url: "https://glexas.com/hostel_data/API/raj/new_admission_list.php",
    method: "POST",
    data: { registration_main_id: registration_main_id },
    dataType: "json",
    success: function (response) {
      var records = response.response;

      if (records && records.length > 0) {
        var record_data = records.find(function (record) {
          return record.registration_main_id == registration_main_id;
        });

        if (record_data) {
          $("#editRecordForm #user_code").val(record_data.user_code);
          $("#editRecordForm #first_name").val(record_data.first_name);
          $("#editRecordForm #middle_name").val(record_data.middle_name);
          $("#editRecordForm #last_name").val(record_data.last_name);
          $("#editRecordForm #phone_number").val(record_data.phone_number);
          $("#editRecordForm #phone_country_code").val(record_data.phone_country_code);
          $("#editRecordForm #email").val(record_data.email);

          $("#editModal").modal("show");
        } else {
          console.error("Record with registration_main_id not found");
        }
      } else {
        console.error("No records found");
      }
    },
    error: function (error) {
      console.error("Error fetching record details for edit", error);
    },
  });
}

function saveChanges() {
  var registration_main_id = editing_registration_main_id;
  var form_data = {
    registration_main_id: registration_main_id,
    user_code: $("#editRecordForm #user_code").val(),
    first_name: $("#editRecordForm #first_name").val(),
    middle_name: $("#editRecordForm #middle_name").val(),
    last_name: $("#editRecordForm #last_name").val(),
    phone_number: $("#editRecordForm #phone_number").val(),
    phone_country_code: $("#editRecordForm #phone_country_code").val(),
    email: $("#editRecordForm #email").val(),
  };

  $.ajax({
    url: "https://glexas.com/hostel_data/API/raj/new_admission_update.php",
    method: "POST",
    data: form_data,
    dataType: "json",
    success: function (response) {
      console.log("Record updated successfully", response);
      var table = $("#myTable").DataTable();
      var index = table.row("#" + registration_main_id).index();
      table.row(index).data(response.response).draw();
      $("#editModal").modal("hide");
    },
    error: function (error) {
      console.error("Error updating record", error);
    },
  });
}

function refreshDataTable() {
  $.ajax({
    url: "https://glexas.com/hostel_data/API/raj/new_admission_list.php",
    method: "GET",
    dataType: "json",
    success: function (response) {
      var data = response.response;
      var table = $("#myTable").DataTable();
      table.clear().rows.add(data).draw();
    },
    error: function (error) {
      console.error("Error fetching data from the API", error);
    },
  });
}

$(document).ready(function () {
  $.ajax({
    url: "https://glexas.com/hostel_data/API/raj/new_admission_list.php",
    method: "GET",
    dataType: "json",
    success: function (response) {
      var data = response.response;

      $("#my_table").DataTable({
        data: data,
        columns: [
          { data: "registration_main_id" },
          { data: "user_code" },
          { data: "first_name" },
          { data: "middle_name" },
          { data: "last_name" },
          { data: "phone_number" },
          { data: "phone_country_code" },
          { data: "email" },
          { data: "created_time" },
          {
            data: null,
            render: function (data, type, row) {
              return `
                <button class="btn btn-success edit-record" data-registration_main_id="${row.registration_main_id}">✏️<div class="hide">Edit</div></button>
                <button class="btn btn-danger delete-record" data-registration_main_id="${row.registration_main_id}">🗑️<div class="hide">Edit</div></button>
              `;
            },
          },
        ],
      });
    },
    error: function (error) {
      console.error("Error fetching data from the API", error);
    },
  });

  $("#myTable").on("click", ".edit-record", function () {
    var registration_main_id = $(this).data("registration_main_id");
    openEditModal(registration_main_id);
  });

  $("#myTable").on("click", ".delete-record", function () {
    var registration_main_id = $(this).data("registration_main_id");
    if (confirm("Are you sure you want to delete this record?")) {
      var table = $("#myTable").DataTable();
      table.row($(this).closest("tr")).remove().draw();
      deleteRecord(registration_main_id);
    }
  });

  $("#editModal").on("show.bs.modal", function () {
    openEditModal(editing_registration_main_id);
  });

  $("#editRecordForm #saveChanges").on("click", function () {
    saveChanges();
  });
});