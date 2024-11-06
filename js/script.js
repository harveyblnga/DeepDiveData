// script.js
const budgetData = [
  { name: "Rent", value: 65, checked: true },
  { name: "Food", value: 20, checked: true },
  { name: "Communication", value: 9, checked: true },
  { name: "Medical aid", value: 5, checked: true },
  { name: "Funeral cover", value: 6, checked: true },
  { name: "Transport", value: 25, checked: true }
];

const ctx = document.getElementById('budgetChart').getContext('2d');
let budgetChart;
let showDaily = false;

function updateChart() {
  const labels = budgetData.filter(item => item.checked).map(item => item.name);
  const data = budgetData.filter(item => item.checked).map(item => item.value);

  if (budgetChart) {
    budgetChart.destroy();
  }

  budgetChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#9966ff'],
      }]
    },
    options: {
      plugins: {
        datalabels: {
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = (value / total * 100).toFixed(2) + '%';
            return percentage;
          },
          color: '#fff',
          labels: {
            title: {
              font: {
                weight: 'bold'
              }
            }
          }
        }
      }
    }
  });

  updateTotal();
}

function renderItems() {
  const itemsList = document.getElementById('itemsList');
  itemsList.innerHTML = '';

  budgetData.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleItem(${index})">
      <span>${item.name}</span>
      <input type="number" value="${item.value}" onchange="updateItemValue(${index}, this.value)">
      <button onclick="removeItem(${index})">X</button>`;
    itemsList.appendChild(li);
  });

  updateTotal();
}

function addItem() {
  const itemName = document.getElementById('itemName').value;
  const itemValue = document.getElementById('itemValue').value;

  if (itemName && itemValue) {
    budgetData.push({ name: itemName, value: parseFloat(itemValue), checked: true });
    document.getElementById('itemName').value = '';
    document.getElementById('itemValue').value = '';
    updateChart();
    renderItems();
  }
}

function removeItem(index) {
  budgetData.splice(index, 1);
  updateChart();
  renderItems();
}

function toggleItem(index) {
  budgetData[index].checked = !budgetData[index].checked;
  updateChart();
}

function updateItemValue(index, value) {
  budgetData[index].value = parseFloat(value);
  updateChart();
}

function updateTotal() {
  const totalValue = budgetData.filter(item => item.checked).reduce((sum, item) => sum + parseFloat(item.value), 0);
  const totalValueElement = document.getElementById('totalValue');
  
  totalValueElement.textContent = totalValue.toFixed(2);
  
  // Check if the total exceeds $130 and change color to red if it does
  if (totalValue > 130) {
    totalValueElement.style.color = 'red';
  } else {
    totalValueElement.style.color = 'black'; // reset to black if it's within budget
  }
}

function toggleCosts() {
  showDaily = !showDaily;
  document.getElementById('toggleButton').textContent = showDaily ? 'Show Monthly Costs' : 'Show Daily Costs';
  
  budgetData.forEach(item => {
    if (showDaily) {
      item.value = (item.value / 30).toFixed(2);
    } else {
      item.value = (item.value * 30).toFixed(2);
    }
  });

  updateChart();
  renderItems();
}

document.getElementById('addItemButton').addEventListener('click', addItem);
document.getElementById('toggleButton').addEventListener('click', toggleCosts);

renderItems();
updateChart();