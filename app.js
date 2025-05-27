document.addEventListener('DOMContentLoaded', () => {

    let vehicles = [];
    try {
        vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    } catch (e) {
        console.error('Error loading vehicles from localStorage:', e);
        alert('Error al cargar los datos. Verifica la consola.');
    }

   
    const vehicleTable = document.getElementById('vehicleTable');
    const saveButton = document.getElementById('saveButton');
    const modalElement = document.getElementById('exampleModal');
    let editingIndex = -1; 
    if (!vehicleTable) console.error('vehicleTable element not found');
    if (!saveButton) console.error('saveButton element not found');
    if (!modalElement) console.error('exampleModal element not found');

 function displayVehicles() {
        if (!vehicleTable) return;
        vehicleTable.innerHTML = ''; 
        vehicles.forEach((vehicle, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vehicle.marca}</td>
                <td>${vehicle.modelo}</td>
                <td>${vehicle.anio}</td>
                <td>${vehicle.placa}</td>
                <td>${vehicle.costo}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-index="${index}"><i class="bi bi-pencil"></i> Editar</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}"><i class="bi bi-trash"></i> Eliminar</button>
                </td>
            `;
            vehicleTable.appendChild(row);
        });


        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('button').dataset.index);
                editVehicle(index);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('button').dataset.index);
                deleteVehicle(index);
            });
        });
    }


    function saveVehicle() {
        const vehicle = {
            marca: document.getElementById('marca').value.trim(),
            modelo: document.getElementById('modelo').value.trim(),
            anio: document.getElementById('anio').value.trim(),
            placa: document.getElementById('placa').value.trim(),
            costo: document.getElementById('costo').value.trim()
        };

       
        if (!vehicle.marca || !vehicle.modelo || !vehicle.anio || !vehicle.placa || !vehicle.costo) {
            alert('Por favor, completa todos los campos');
            return;
        }


        if (!/^\d{4}$/.test(vehicle.anio)) {
            alert('El año debe ser un número de 4 dígitos');
            return;
        }
        if (!/^\d+(\.\d{1,2})?$/.test(vehicle.costo)) {
            alert('El costo debe ser un número válido (ej. 25000 o 25000.99)');
            return;
        }

        try {
            if (editingIndex === -1) {
                // Add new vehicle
                vehicles.push(vehicle);
            } else {
                
                vehicles[editingIndex] = vehicle;
                editingIndex = -1; 
            }


            localStorage.setItem('vehicles', JSON.stringify(vehicles));
            console.log('Vehicles saved to localStorage:', vehicles);


            clearForm();
            displayVehicles();

            
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            } else {
                console.error('Modal instance not found');
            }
        } catch (e) {
            console.error('Error saving vehicle:', e);
            alert('Error al guardar el vehículo. Verifica la consola.');
        }
    }

   
    function editVehicle(index) {
        editingIndex = index;
        const vehicle = vehicles[index];

      
        document.getElementById('marca').value = vehicle.marca;
        document.getElementById('modelo').value = vehicle.modelo;
        document.getElementById('anio').value = vehicle.anio;
        document.getElementById('placa').value = vehicle.placa;
        document.getElementById('costo').value = vehicle.costo;

        
        document.getElementById('exampleModalLabel').textContent = 'EDITAR VEHICULO';

       
        try {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        } catch (e) {
            console.error('Error opening modal:', e);
            alert('Error al abrir el formulario de edición.');
        }
    }


    function deleteVehicle(index) {
        if (confirm('¿Estás seguro de eliminar este vehículo?')) {
            try {
                vehicles.splice(index, 1);
                localStorage.setItem('vehicles', JSON.stringify(vehicles));
                console.log('Vehicle deleted, updated localStorage:', vehicles);
                displayVehicles();
            } catch (e) {
                console.error('Error deleting vehicle:', e);
                alert('Error al eliminar el vehículo. Verifica la consola.');
            }
        }
    }

   
    function clearForm() {
        document.getElementById('marca').value = '';
        document.getElementById('modelo').value = '';
        document.getElementById('anio').value = '';
        document.getElementById('placa').value = '';
        document.getElementById('costo').value = '';
        document.getElementById('exampleModalLabel').textContent = 'AGREGAR VEHICULO';
        editingIndex = -1;
    }

    
    if (saveButton) {
        saveButton.addEventListener('click', saveVehicle);
    } else {
        console.error('saveButton not found, cannot attach event listener');
    }

    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', clearForm);
    } else {
        console.error('modalElement not found, cannot attach modal event listener');
    }

   
    displayVehicles();
});