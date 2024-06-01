
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
    import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-analytics.js";
    import { getDatabase, ref, set, onValue, update, remove, push } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyBse7-H0qOg9Tf874rWm9gu-av7EB73V08",
      authDomain: "registration-form-7f468.firebaseapp.com",
      databaseURL: "https://registration-form-7f468-default-rtdb.firebaseio.com",
      projectId: "registration-form-7f468",
      storageBucket: "registration-form-7f468.appspot.com",
      messagingSenderId: "967561847121",
      appId: "1:967561847121:web:6d6e3bcdb499ddd458b370",
      measurementId: "G-4X4KCQLRC2"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getDatabase(app);

    function registerStudent() {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const dob = document.getElementById('dob').value;
      const phone = document.getElementById('phone').value;

      if (name && email && dob && phone) {
        const studentId = push(ref(db, 'students')).key;
        set(ref(db, 'students/' + studentId), {
          id: studentId,
          name: name,
          email: email,
          dob: dob,
          phone: phone
        });

        clearForm();
        alert('Student Registered Successfully!');
        getStudents();
      } 
    }

    function clearForm() {
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('dob').value = '';
      document.getElementById('phone').value = '';
    }

    function getStudents() {
      const studentsRef = ref(db, 'students/');
      onValue(studentsRef, (snapshot) => {
        const students = snapshot.val();
        const studentList = document.getElementById('student-list');
        studentList.innerHTML = '';
        if (students) {
          Object.keys(students).forEach((key) => {
            const student = students[key];
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${student.name}</td>
              <td>${student.email}</td>
              <td>${student.dob}</td>
              <td>${student.phone}</td>
              <td class="actions">
                <button onclick="editStudent('${student.id}')">Edit</button>
                <button onclick="deleteStudent('${student.id}')">Delete</button>
              </td>
            `;
            studentList.appendChild(row);
          });
        }
      });
    }

    function editStudent(id) {
      const studentRef = ref(db, 'students/' + id);
      onValue(studentRef, (snapshot) => {
        const student = snapshot.val();
        document.getElementById('name').value = student.name;
        document.getElementById('email').value = student.email;
        document.getElementById('dob').value = student.dob;
        document.getElementById('phone').value = student.phone;

        // Change the register button to save button
        const registerButton = document.querySelector('.form-group button');
        registerButton.innerText = 'Save Changes';
        registerButton.onclick = function() {
          saveChanges(id);
        };
      }, {
        onlyOnce: true
      });
    }

    function saveChanges(id) {
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const dob = document.getElementById('dob').value;
      const phone = document.getElementById('phone').value;

      update(ref(db, 'students/' + id), {
        name: name,
        email: email,
        dob: dob,
        phone: phone
      });

      clearForm();

      // Change the save button back to register button
      const registerButton = document.querySelector('.form-group button');
      registerButton.innerText = 'Register';
      registerButton.onclick = registerStudent;

      alert('Student Updated Successfully!');
      getStudents();
    }

    function deleteStudent(id) {
      remove(ref(db, 'students/' + id));
      alert('Student Deleted Successfully!');
      getStudents();
    }

    // Attach the event listener
    document.getElementById('registerButton').addEventListener('click', registerStudent);

    // Attach the functions to the window object
    window.registerStudent = registerStudent;
    window.editStudent = editStudent;
    window.saveChanges = saveChanges;
    window.deleteStudent = deleteStudent;

    // Load existing students on page load
    window.onload = getStudents;