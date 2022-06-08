cardRow = document.getElementById("card-row")
pages = document.getElementById("pages")

let test_type = cardRow.attributes[2].value

console.log(test_type)

if(window.location.pathname == "/dashboard/" || window.location.pathname == "/dashboard" ){
  reloadFunction(1)
}

if(window.location.pathname == `/dashboard/${test_type}/` || window.location.pathname == `/dashboard/${test_type}` )
{
  reloadFunction(1)
}
console.log(window.location.pathname)

let URL = window.location.href
console.log(URL)
let currentPage = parseInt(URL.slice(-1))

if(currentPage==="t"){
  currentPage = 1;
}
function reloadFunction(page){
  window.location.replace(`${location.origin}/dashboard/${test_type}/page=${page}`)
}

function hello(text){
  console.log(text)
}

function createPagination(pages, page) {
  let str = '<ul class="pagination justify-content-center">';
  let active;
  let pageCutLow = page - 1;
  let pageCutHigh = page + 1;
  // Show the Previous button only if you are on a page other than the first
  if (page > 1) {
    str += `<li class="page-item previous no"><a onclick="reloadFunction(${page-1})" class = "page-link" onclick="createPagination(${pages}, ${page-1})">Previous</a></li>`;
  }
  // Show all the pagination elements if there are less than 6 pages total
  if (pages < 6) {
    for (let p = 1; p <= pages; p++) {
      active = page == p ? "active" : "no";
      str += `<li class=" page-item ${active}"><a onclick="reloadFunction(${p})" class = "page-link" onclick="createPagination(${pages}, ${p})"> ${p} </a></li>`;
    }
  }
  // Use "..." to collapse pages outside of a certain range
  else {
    // Show the very first page followed by a "..." at the beginning of the
    // pagination section (after the Previous button)
    if (page > 2) {
      str += `<li class="no page-item"><a onclick="reloadFunction(${1})" class = "page-link" onclick="createPagination(${pages}, ${1})">1</a></li>`;
      if (page > 3) {
          str += `<li class="out-of-range"><a onclick="reloadFunction(${page-2})" class = "page-link" onclick="createPagination(${pages},${page-2})">...</a></li>`;
      }
    }
    // Determine how many pages to show after the current page index
    if (page === 1) {
      pageCutHigh += 2;
    } else if (page === 2) {
      pageCutHigh += 1;
    }
    // Determine how many pages to show before the current page index
    if (page === pages) {
      pageCutLow -= 2;
    } else if (page === pages-1) {
      pageCutLow -= 1;
    }
    // Output the indexes for pages that fall inside the range of pageCutLow
    // and pageCutHigh
    for (let p = pageCutLow; p <= pageCutHigh; p++) {
      if (p === 0) {
        p += 1;
      }
      if (p > pages) {
        continue
      }
      active = page == p ? "active" : "no";
      str += `<li class="page-item ${active}"><a onclick="reloadFunction(${p})" class = "page-link" onclick="createPagination(${pages}, ${p})">${p}</a></li>`;
    }
    // Show the very last page preceded by a "..." at the end of the pagination
    // section (before the Next button)
    if (page < pages-1) {
      if (page < pages-2) {
        str += `<li class="out-of-range"><a onclick="reloadFunction(${page+2})" class = "page-link" onclick="createPagination(${pages},${page+2})">...</a></li>`;
      }
      str += `<li class="page-item no"><a onclick="reloadFunction(${pages})" class = "page-link" onclick="createPagination(${pages}, ${pages})">${pages}</a></li>`;
    }
  }
  // Show the Next button only if you are on a page other than the last
  if (page < pages) {
    str += `<li class="page-item next no"><a onclick="reloadFunction(${page+1})" class = "page-link" onclick="createPagination(${pages}, ${page+1})">Next</a></li>`;
  }
  str += '</ul>';
  // Return the pagination string to be outputted in the pug templates
  document.getElementById('paginations').innerHTML = str;
  return str;
}

fetch(`https://meshery.layer5.io/smp/performance/profiles/?page=${currentPage-1}`, { 
    method: "GET"
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    if(test_type=="all"){
    let content = " "
    for(let i = 0;i<data.profiles.length;i++){
        content += `
            <div class="col-sm-6" style="margin-bottom: 20px" >
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${data.profiles[i].name}</h5>
                        <p class="card-text">
                            Performance profile number ${i+1}
                        </p>
                         <a href="${location.origin}/dashboard/performance#${data.profiles[i].id}/page=1"  class="btn btn-primary">Show Results</a>
                    </div>
                 </div>
            </div>
            
        `
    }
    let numberOfPages = Math.ceil(data.total_count/10);
    console.log(numberOfPages)

    document.getElementById('paginations').innerHTML = createPagination(numberOfPages, currentPage);

    console.log(content);
    cardRow.innerHTML = content;
  }
  else {
  let total_item = 0
  let content = " "
  for(let i = 0;i<data.profiles.length;i++){
      let parse_test_type = data.profiles[i].name.split("-")[2]
      if(parse_test_type==test_type){
      total_item = total_item+1;
      content += `
          <div class="col-sm-6" style="margin-bottom: 20px" >
              <div class="card">
                  <div class="card-body">
                      <h5 class="card-title">${data.profiles[i].name}</h5>
                      <p class="card-text">
                          Performance profile number ${i+1}
                      </p>
                       <a href="${location.origin}/dashboard/performance#${data.profiles[i].id}/page=1"  class="btn btn-primary">Show Results</a>
                  </div>
               </div>
          </div>
          
      `
  }
  let numberOfPages = Math.ceil(total_item/10);
  console.log(numberOfPages)

  document.getElementById('paginations').innerHTML = createPagination(numberOfPages, currentPage);

  console.log(content);
  cardRow.innerHTML = content;
}
}
  })