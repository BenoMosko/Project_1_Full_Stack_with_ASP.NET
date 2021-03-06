//Get User Full Name to show when Logged in on top of each page
async function getUserID()
{
    const urlParams = new URLSearchParams(window.location.search);
    const userID = urlParams.get("UserId");

    let response =  await fetch("https://localhost:44345/api/Users/" + userID);

    let user = await response.json();

    document.getElementById("user_full_name").innerText = user.Full_Name
    // sessionUserId = sessionStorage.setItem("ID", userID)
}

//LogIn function
async function logIn()
{
    const userObject = {User_Name : document.getElementById("username").value, Password : document.getElementById("password").value};

    const fetchParams =
        {
            method : 'POST',
            body : JSON.stringify(userObject),
            headers : {"Content-type" : "application/json"}
        }
        const response = await fetch("https://localhost:44345/api/LogIn", fetchParams);
        const data = await response.json(); 

    if(data != null)
    {
        const resLog = await fetch("https://localhost:44345/api/LogIn/" + data.ID);
        const dataLog = await resLog.json();
        
        if(dataLog)
        {
            sessionStorage.setItem("FullName",data.Full_Name);
            sessionStorage.setItem("ID",data.ID);
            sessionStorage.setItem("NumberOfActions", data.Number_Of_Actions);
            sessionStorage.setItem("AllowedActions", data.Allowed_Actions);
            window.location.href = "home.html?UserId=" + data.ID;
            
        }
        else
        {
        alert("too many actions per day")
        }
    } 
    else
    {
        alert("Worng UserName/Password")
    };
}



//Log Out function (kind of)
function logOut()
{
    window.location.href = "login.html";
}



//Update User Current Actions
async function updateCurrentAction()
{
    let sessionId = sessionStorage.getItem("ID");
    let sessionAllowedActions = sessionStorage.getItem("AllowedActions");
    let sessionNumOfAct = sessionStorage.getItem("NumberOfActions");

    let obj = {ID : sessionId, Allowed_Actions : sessionAllowedActions, Number_Of_Actions : sessionNumOfAct};

    let fetchParams = { method : 'PUT',
                        body :   JSON.stringify(obj),
                        headers : {"Content-Type" : "application/json"}
                      }

    let resp = await fetch("https://localhost:44345/api/Users/" + obj.ID, fetchParams);
    let status = await resp.json();
}



//Action Counter for Users
async function actionCounter()
{
    let sessionAllowedActions = sessionStorage.getItem("AllowedActions");
    let sessionNumOfAct = sessionStorage.getItem("NumberOfActions");


    if(sessionNumOfAct < sessionAllowedActions)
    {
        sessionNumOfAct ++
        sessionStorage.setItem("NumberOfActions", sessionNumOfAct); 
        updateCurrentAction();
    }
    else
    {
        alert("User Action Exceeded")
        //Clean session storage
        window.location.href = "login.html";

    }
    
}


/*
Departments
*/

//Get Department into a table
async function getDepartmentsTable()
{
    const response = await fetch("https://localhost:44345/api/Departments");
    const departments = await response.json();

    let userFullName = document.getElementById("user_full_name");
    userFullName.innerHTML = sessionStorage.getItem("FullName")
    
    let tableObject = document.getElementById("departments_table");

    departments.forEach(depart =>
    {
       let trObject = document.createElement("tr");

       let tdName = document.createElement("td");
       let tdManager = document.createElement("td");
       let tdEditBTN = document.createElement("td");
       let tdDeleteBTN = document.createElement("td");
       let editButton = document.createElement("BUTTON");  
       let deleteButton = document.createElement("BUTTON");  

       tdName.innerText = depart.Name;
       tdManager.innerText = depart.Manager;
       editButton.textContent = "Edit";
       editButton.setAttribute("onclick", "editDepartmentButton("+ depart.ID+")");
       deleteButton.textContent = "Delete";
       deleteButton.setAttribute("onclick", "deleteDepartment("+ depart.ID+")");

       trObject.appendChild(tdName);
       trObject.appendChild(tdManager);
       trObject.appendChild(editButton)
       trObject.appendChild(tdEditBTN)
       trObject.appendChild(tdDeleteBTN);
       tdEditBTN.appendChild(editButton);
       tdDeleteBTN.appendChild(deleteButton);

       tableObject.appendChild(trObject);
    });
}

//Edit Department Button
async function editDepartmentButton(id)
{
    window.location.href = "editdepartment.html?UserId=" + sessionStorage.getItem("ID") + "&depId=" + id;
}

//Edit Department Page
async function editDepartmentPage()
{
    
    const urlParams = new URLSearchParams(window.location.search);
    const departID = urlParams.get("depId");
    const response = await fetch("https://localhost:44345/api/Departments/" + departID);
    const departments = await response.json();
 
    document.getElementById("user_full_name").innerText = sessionStorage.getItem("FullName");
    document.getElementById("departmentName").innerText = departments.Name;

    console.log(departments);

}

//Update the Department
async function updateDepartment()
{
    actionCounter()
    let departName = document.getElementById("department_name").value;
    let departManager = document.getElementById("department_manager").value;

    const urlParams = new URLSearchParams(window.location.search);
    const departID = urlParams.get("depId");

    let obj = {ID : departID, Name : departName, Manager : departManager}

    let fetchParams = { method : 'PUT',
                        body :   JSON.stringify(obj),
                        headers : {"Content-Type" : "application/json"}
                      }

    let resp = await fetch("https://localhost:44345/api/Departments/" + departID, fetchParams);
    let status = await resp.json() ;
    alert(status);
}


//Delete Department
async function deleteDepartment(id)
{
    actionCounter()
    let fetchParams = { 
                        method : 'DELETE', 
                        headers : {"Content-Type" : "application/json"}
                      }

let resp = await fetch("https://localhost:44345/api/Departments/" + id, fetchParams);
let status = await resp.json() ;
alert(status);

window.location.href = "departments.html?UserId=" + sessionStorage.getItem("ID");

}

//Add Department
async function addDepartment(id)
{
    actionCounter()
    let departName = document.getElementById("add_department_name").value;
    let departManager = document.getElementById("add_department_manager").value;

    let obj = { Name : departName , Manager : departManager};

    let fetchParams = {method : 'POST', body :   JSON.stringify(obj), headers : {"Content-Type" : "application/json"}}

    let resp = await fetch("https://localhost:44345/api/Departments/" + id, fetchParams);
    let status = await resp.json() ;
    alert(status);
    window.location.href = "departments.html?UserId=" + sessionStorage.getItem("ID");
}


/*
Employees
*/

//Get Employees into a table
async function getEmployeeTable()
{
    actionCounter()
    const response = await fetch("https://localhost:44345/api/Employees/");
    const employees = await response.json();

    let userFullName = document.getElementById("user_full_name");
    userFullName.innerHTML = sessionStorage.getItem("FullName")
    
    let tableObject = document.getElementById("employee_table");

    employees.forEach(emp =>
    {
       let trObject = document.createElement("tr");

       let tdFirstName = document.createElement("td");
       let tdLastName = document.createElement("td");
       let tdStartYear = document.createElement("td");
       let tdDepartName = document.createElement("td");
       let tdShiftID = document.createElement("td");
       let tdShiftDate = document.createElement("td");
       let tdShiftStart = document.createElement("td");
       let tdShiftEnd = document.createElement("td");
       let tdEditBTN = document.createElement("td");
       let tdDeleteBTN = document.createElement("td");
       let editButton = document.createElement("BUTTON");  
       let deleteButton = document.createElement("BUTTON");  

       tdFirstName.innerText = emp.First_Name;
       tdLastName.innerText = emp.Last_Name;
       tdStartYear.innerText = emp.Start_Work_Year;
       tdDepartName.innerText = emp.Name;
       tdShiftID.innerText = emp.ShiftID;
       tdShiftDate.innerText = emp.Date;
       tdShiftStart.innerText = emp.Start_Time;
       tdShiftEnd.innerText = emp.End_Time;
       editButton.textContent = "Edit";
       editButton.setAttribute("onclick", "editEmployeeButton("+ emp.ID+")");
       deleteButton.textContent = "Delete";
       deleteButton.setAttribute("onclick", "deleteEmployee("+ emp.ID+")");

       trObject.appendChild(tdFirstName);
       trObject.appendChild(tdLastName);
       trObject.appendChild(tdStartYear);
       trObject.appendChild(tdDepartName);
       trObject.appendChild(tdShiftID);
       trObject.appendChild(tdShiftDate);
       trObject.appendChild(tdShiftStart);
       trObject.appendChild(tdShiftEnd);
       trObject.appendChild(editButton)
       trObject.appendChild(tdEditBTN)
       trObject.appendChild(tdDeleteBTN);
       tdEditBTN.appendChild(editButton);
       tdDeleteBTN.appendChild(deleteButton);

       tableObject.appendChild(trObject);       
    });
}


//Search Employee function
async function getSearchData()
{
    const response = await fetch("https://localhost:44345/api/Employees/");
    const employees = await response.json();
    let searchResult = document.getElementById("search_employee").value;

    employees.forEach(emp =>
        {
            if(emp.First_Name == searchResult || emp.Last_Name == searchResult|| emp.DepartmentID == searchResult)
            {
                window.location.href = "searchresult.html?UserId=" + sessionStorage.getItem("ID") + "&empId=" + emp.ID + "&empFN=" + emp.First_Name + "&empLN=" + emp.Last_Name + "&empDep=" + emp.Name;
            }
            else
            {

            }
        });
}

//Edit Employee Button
async function editEmployeeButton(id)
{
    window.location.href = "editemployee.html?UserId=" + sessionStorage.getItem("ID") + "&empId=" + id;
}

//Edit Employee Page
async function editEmployeePage()
{
    
    const urlParams = new URLSearchParams(window.location.search);
    const empID = urlParams.get("empId");
    const response = await fetch("https://localhost:44345/api/Employees/" + empID);
    const emp = await response.json();

    document.getElementById("user_full_name").innerText = sessionStorage.getItem("FullName");
    emp.forEach(em =>
        {
            document.getElementById("employee_first_name").innerText = em.First_Name
            document.getElementById("employee_last_name").innerText = em.Last_Name
        });
    
}

//Update Employee
async function updateEmployee()
{
    actionCounter()
    const urlParams = new URLSearchParams(window.location.search);
    const empID = urlParams.get("empId");

    let employeeFirstName = document.getElementById("empfirstname").value;
    let employeeLastName = document.getElementById("emplastname").value;
    let employeeStartWork = document.getElementById("empstartwork").value;
    let employeeDepartment = document.getElementById("empdepartment").value;
    let employeeShift = document.getElementById("empshift").value;

    let obj = {
                First_Name : employeeFirstName, 
                Last_Name : employeeLastName,
                Start_Work_Year : employeeStartWork,
                Name : employeeDepartment,
                ShiftID : employeeShift
              }

    let fetchParams = { method : 'PUT',
                        body :   JSON.stringify(obj),
                        headers : {"Content-Type" : "application/json"}
                    }

    let resp = await fetch("https://localhost:44345/api/Employees/" + empID, fetchParams);
    let status = await resp.json() ;
    alert(status);
}

//Delete Employee
async function deleteEmployee(id)
{
    actionCounter()
    let fetchParams = { 
                        method : 'DELETE', 
                        headers : {"Content-Type" : "application/json"}
                      }

let resp = await fetch("https://localhost:44345/api/Employees/" + id, fetchParams);
let status = await resp.json() ;
alert(status);

window.location.href = "employees.html?UserId=" + sessionStorage.getItem("ID");

}

//Add Employee
async function addEmployee(id)
{
    actionCounter()
    let employeeFirstName = document.getElementById("add_employee_first_name").value;
    let employeeLastName = document.getElementById("add_employee_last_name").value;
    let employeeStartWork = document.getElementById("add_employee_work_year").value;
    let employeeDepartment = document.getElementById("add_employee_department").value;
    let employeeShift = document.getElementById("add_employee_shift").value;

    let obj = {
                First_Name : employeeFirstName, 
                Last_Name : employeeLastName,
                Start_Work_Year : employeeStartWork,
                DepartmentID : employeeDepartment,
                ShiftID : employeeShift
              };

    let fetchParams = {method : 'POST', body :   JSON.stringify(obj), headers : {"Content-Type" : "application/json"}}

    let resp = await fetch("https://localhost:44345/api/Employees/" + id, fetchParams);
    let status = await resp.json() ;
    alert(status);
    window.location.href = "employees.html?UserId=" + sessionStorage.getItem("ID");
}


/*
Shifts
*/

//Get Shifts into a table
async function getShiftTable()
{
    actionCounter()
    const response = await fetch("https://localhost:44345/api/Shifts/");
    const shifts = await response.json();

    let userFullName = document.getElementById("user_full_name");
    userFullName.innerHTML = sessionStorage.getItem("FullName")
    
    let tableObject = document.getElementById("shift_table");

    shifts.forEach(sh =>
    {
       let trObject = document.createElement("tr");

    //    let tdShiftID = document.createElement("td");
       let tdShiftDate = document.createElement("td");
       let tdShiftStart = document.createElement("td");
       let tdShiftEnd = document.createElement("td");
    //    let tdEmpID = document.createElement("td");
    //    let tdFirstName = document.createElement("td");
    //    let tdLastName = document.createElement("td");
 

    //    tdShiftID.innerText = sh.ShiftID;
       tdShiftDate.innerText = sh.Date;
       tdShiftStart.innerText = sh.Start_Time;
       tdShiftEnd.innerText = sh.End_Time;
    //    tdEmpID.innerText = sh.EmployeeID;
    //    tdFirstName.innerText = sh.First_Name;
    //    tdLastName.innerText = sh.Last_Name;

    //    trObject.appendChild(tdShiftID);
       trObject.appendChild(tdShiftDate);
       trObject.appendChild(tdShiftStart);
       trObject.appendChild(tdShiftEnd);
    //    trObject.appendChild(tdEmpID);
    //    trObject.appendChild(tdFirstName);
    //    trObject.appendChild(tdLastName);

       tableObject.appendChild(trObject);       
    });
}

//Add Shift
async function addShift(id)
{
    actionCounter()
    let shiftDate = document.getElementById("add_shift_date").value;
    let shiftStart = document.getElementById("add_shift_start").value;
    let shiftEnd = document.getElementById("add_shift_end").value;

    let obj = {
                Date : shiftDate, 
                Start_Time : shiftStart,
                End_Time : shiftEnd,
              };

    let fetchParams = {method : 'POST', body :   JSON.stringify(obj), headers : {"Content-Type" : "application/json"}}

    let resp = await fetch("https://localhost:44345/api/Shifts/" + id, fetchParams);
    let status = await resp.json() ;
    alert(status);
    window.location.href = "shifts.html?UserId=" + sessionStorage.getItem("ID");
}
