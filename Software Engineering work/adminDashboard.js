let numberOfStudents=document.getElementById("number-of-students");
let numberOfCourses=document.getElementById("number-of-courses");
let numberOfRooms=document.getElementById("number-of-rooms")
let loader=document.getElementById("loader");
let main_container=document.getElementById("main-container");
let url="http://localhost:9000"

async function getNumbers(){
    let jwt_token=localStorage.getItem("jwt_token");
    jwt_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imdyb3VwNEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6Imdyb3VwLTQiLCJpYXQiOjE3MTQ1NTIwODUsImV4cCI6MTcxNDU5NTI4NX0.hVtY2KgnXveIjv5bzU7F_iH57Y6u-FngXoDPto85Yqw";
    let apiUrl=url+'/admin/dashboard';
    //loader.classList.toggle("d-none");
    let options={
        method:'GET',
        headers:{
            "Content-Type":'application/json',
            'Authorization':`Bearer ${jwt_token}`
        }
    }
    try {
        // Fetch data from API
        let response = await fetch(apiUrl, options);

        // Check if response is successful
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse response data
        let data = await response.json();
        
        // Log the data
        console.log(data);
        numberOfStudents.textContent=data.totalStudents;
        numberOfRooms.textContent=data.totalRooms;
        numberOfCourses.textContent=data.totalCourses;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
    loader.classList.toggle("d-none");
    //loader.textContent="";
    main_container.classList.toggle("d-none");

}

getNumbers()