

const regExp=new RegExp("[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+");
const regExpId=new RegExp("[0-9]");

async function combinarEmployeesConCompanies(employees, companies) {
    return employees.map(employee => {
        const company = companies.find(company => company.companyId === employee.companyId);
        if (company) {
            employee.company = company;
        }
        return employee;
    });
}

async function obtenerCompanies() {
    try {
        const response = await fetch('https://utn-lubnan-api-1.herokuapp.com/api/Company');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener la lista de Companies:', error);
        throw error;
    }
}

async function obtenerEmployees() {
    try {
        const response = await fetch('https://utn-lubnan-api-1.herokuapp.com/api/Employee');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener la lista de Employees:', error);
        throw error;
    }
}


async function loadTableEmployee() {
    try {
        const [employees, companies] = await Promise.all([obtenerEmployees(), obtenerCompanies()]);
        const employeesConCompanies = await combinarEmployeesConCompanies(employees, companies);
        console.log(employeesConCompanies);

        let tableBody = document.createElement('tbody'); // Crear el tbody
        employeesConCompanies.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.employeeId}</td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.email}</td>
                <td>${employee.companyId}</td>
            `;
            tableBody.appendChild(row); // Agregar cada fila de datos al tbody
        });
        return tableBody; // Devolver solo el tbody
    } catch (error) {
        console.error('Error al obtener Employees con Companies:', error);
    }
    return null;
}

async function showEmployeesAsync() {
    let oldTable = document.getElementById('dataTable');
    if (oldTable != null) {
        oldTable.remove();
    }

    let daddy = document.getElementById('tableDaddy');

    let newTable = document.createElement('table');
    newTable.className = 'table table-striped';
    newTable.id = 'dataTable';
    newTable.innerHTML = `
    <thead>
      <tr>
          <th scope="col">N</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">E-mail</th>
          <th scope="col">Company</th>
      </tr>
    </thead>
    `

    let tbody = document.createElement('tbody');

    let employeeData = await loadTableEmployee();


    newTable.appendChild(employeeData);

    daddy.appendChild(newTable);
}

//esta funcion se encarga de crear un  Json de un empleado y hacer el post de los datos a la API
function postEmployee() {
    let employeeData = [
        document.getElementById('firstName').value,
        document.getElementById('lastName').value,
        document.getElementById('mail').value,
        document.getElementById('selectedCompanyId').value
    ]

    let p = document.getElementById('addedEmployee');
    p.innerText = '';

    if (regExp.test(employeeData[2]) == true) {
        let newEmployee = JSON.stringify({
            "companyId": Number.parseInt(employeeData[3]),
            "firstName": employeeData[0],
            "lastName": employeeData[1],
            "email": employeeData[2],
        });

        apiInteraction('POST', "https://utn-lubnan-api-1.herokuapp.com/api/Employee", newEmployee)
            .then((response) => {
                p.innerText = 'Employee ' + employeeData[0] + ' ' + employeeData[1] + ', added succesfuly';
                p.style.color = "green";
            })
            .catch((reason) => {
                console.log(Error(reason));
                p.innerText = 'Cannot add employee, please try later';
                p.style.color = "red";
            })

    } else {
        p.innerText = 'invalid email';
        p.style.color = "red";
    }

}

function deleteEmployee() {
    let id = document.getElementById("firedEmployeeId").value;
    let p = document.getElementById("afterFireComunication");
    p.innerText = '';
    if (regExpId.test(id) == true) {
        let apiLink = "https://utn-lubnan-api-1.herokuapp.com/api/Employee/" + id;
        apiInteraction('DELETE', apiLink, null)
            .then((response) => {
                console.log(response);
                p.innerText = 'Succesfully fired';
                p.style.color = "green";
            })
            .catch((reason) => {
                console.log(Error(reason));
                p.innerText = 'the sindicate has show up, you cant fire this employee, at least for now...';
                p.style.color = "red";
            })
    } else {
        p.innerText = 'please only put numbers in the box';
        p.style.color = "red";
    }


}

function apiInteraction(HTTPMethod,url,body){
    return new Promise((resolve,reject)=>{
      var request=new XMLHttpRequest();
      request.open(HTTPMethod,url);
      request.onload=()=>{
        if(request.readyState == 4 && request.status == 200){
          if(request.responseText!=''){
            resolve(JSON.parse(request.responseText))
          }else{
            resolve(request.responseText);
          }
        }else{
          reject(`Error: ${request.status}`);
        }
      }
      if(HTTPMethod=='POST'){
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(body);
      }else{
        request.send();
      }
    })
}