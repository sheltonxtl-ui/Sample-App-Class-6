console.log("Script loaded")

const supabaseUrl = 'https://tnrxydirxnwloktmkdcx.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucnh5ZGlyeG53bG9rdG1rZGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzkyODAsImV4cCI6MjA4NjkxNTI4MH0.nreEldhBSpxgCHt6nMnnpG0jbl8JcddyQSXrhg8UaC4"

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

async function getProducts() {
  console.log("Fetching products...")

  const { data, error } = await supabaseClient
    .from('Products')
    .select('*')

  console.log("DATA:", data)
  console.log("ERROR:", error)

  if (error) {
    console.error(error.message)
    return
  }

  if (!data || data.length === 0) {
    console.log("No products found.")
    return
  }

  renderProducts(data)
}

function renderProducts(products) {
  const container = document.getElementById("Products")

  if (!container) {
    console.error("Container not found!")
    return
  }

  container.innerHTML = ""

  products.forEach(product => {
    const card = document.createElement("div")

    card.className =
      "bg-slate-800 p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center border border-slate-700"

    card.innerHTML = `
      <div>
        <h3 class="font-medium text-white">
          ${product.title}
        </h3>
        <p class="text-xs text-slate-400 mt-1">
          $${product.price}
        </p>
      </div>

      <span class="bg-indigo-600 text-xs px-3 py-1 rounded-full">
        In Stock
      </span>
    `

    container.appendChild(card)
  })
}

async function loadActivityFeed() {
  console.log("Fetching activity...")

  const { data, error } = await supabaseClient
    .from('Order')   
    .select('customer_id')

  if (error) {
    console.error("Activity Error:", error.message)
    return
  }

  if (!data || data.length === 0) {
    console.log("No orders found.")
    return
  }

  // Count orders per customer
  const orderCount = {}

  data.forEach(order => {
    const id = order.customer_id
    orderCount[id] = (orderCount[id] || 0) + 1
  })

  const feedContainer = document.getElementById("activity-feed")
  feedContainer.innerHTML = ""

  Object.keys(orderCount).forEach(customer => {
    const item = document.createElement("div")

    item.className =
      "bg-slate-800 p-4 rounded-lg border border-slate-700"

    item.innerHTML = `
      <p class="text-white font-medium">
        Customer ${customer}
      </p>
      <p class="text-slate-400 text-xs mt-1">
        Ordered ${orderCount[customer]} time(s)
      </p>
    `

    feedContainer.appendChild(item)
  })
}

document.addEventListener("DOMContentLoaded", function () {
  getProducts()
  loadActivityFeed()
})