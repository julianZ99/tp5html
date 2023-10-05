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

    let daddy=document.getElementById('tableDaddy');

    let newTable=document.createElement('table');
    newTable.className='table table-striped';
    newTable.id='dataTable';
    newTable.innerHTML=`
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
