const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vScPc9M9VosL-tyjZhUwvx2Tftj1aLIAiRdUdbD2ajyxClbekXUqf9pbP9ejM4xuJhlj9KznQXjVoA-/pubhtml';

const paypalEmail = 'pagosdeandres@gmail.com';

let dataItems = [];

function init() {

  Tabletop.init({

    key: publicSpreadsheetUrl,

    callback: showInfo,

    simpleSheet: true,

  });

}

function showInfo(data) {

  dataItems = data; // Guardamos la data globalmente

  const itemsContainer = document.getElementById('items');

  const select = document.getElementById('categoria');

  const categorias = new Set();

  data.forEach(item => {

    categorias.add(item.Categoría);

  });

  categorias.forEach(cat => {

    const option = document.createElement('option');

    option.value = cat;

    option.textContent = cat;

    select.appendChild(option);

  });

  function renderItems(filtro) {

    itemsContainer.innerHTML = '';

    const filtrados = filtro === 'Todas' ? data : data.filter(item => item.Categoría === filtro);

    filtrados.forEach(item => {

      const card = document.createElement('div');

      card.className = 'card';

      card.innerHTML = `

        <img src="${item.Foto}" alt="Norma ${item.Categoría}">

        <div class="card-content">

          <h3>${item.Descripción}</h3>

          <p><strong>Categoría:</strong> ${item.Categoría}</p>

          <p><strong>Precio:</strong> $${item.Precio}</p>

        </div>

        <button onclick="comprarConCupon('${item.Descripción}')">Obtener</button>

      `;

      itemsContainer.appendChild(card);

    });

  }

  renderItems('Todas');

  select.addEventListener('change', () => renderItems(select.value));

}

function comprarConCupon(descripcion) {

  const item = dataItems.find(i => i.Descripción === descripcion);

  if (!item) return alert("Error: ítem no encontrado.");

  const cupónIngresado = prompt(`¿Tienes un código de descuento para "${descripcion}"?\nSi no tienes uno, deja el campo vacío para proceder al pago por PayPal:`);

  if (cupónIngresado && cupónIngresado.trim() === item.Código) {

    // Código correcto, permitir acceso directo

    alert("¡Código válido! Accediendo al documento...");

    window.open(item.Link, "_blank");

  } else {

    // Código incorrecto o vacío, redirigir a PayPal

    const url = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${paypalEmail}&item_name=${encodeURIComponent(descripcion)}&amount=${item.Precio}&currency_code=USD&return=${encodeURIComponent(item.Link)}`;

    window.open(url, '_blank');

  }

}

window.addEventListener('DOMContentLoaded', init);
