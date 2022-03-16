import './style.css'; 

const container= document.getElementById('container');
const left = document.getElementById('leftpanel');
const right = document.getElementById('rightpanel');

const projectIndex = document.createElement('ul');
const taskList = document.createElement('ul');
                taskList.id="taskList";
const projectBox= document.createElement('div'); 
projectBox.id = "projectBox";


const projectHeading = document.createElement('div');
projectHeading.textContent='Default';
projectHeading.id='projectHeading';
projectBox.appendChild(projectHeading);
right.appendChild(projectBox);


const Project = (title , description) => {
    return {title , description };
} 

const ProjectFactory = (pid, pname, pdescription) => {
    let todos = []; 

    const findTodo = () => {

    }

    const addTodo = (id, name, description, dueDate, priority ) => {
        const newTodo = TodoFactory(id , name,description);
        todos.push(newTodo);
    } 

    const getAllTodos = () => todos; 

    const deleteTodo = (id) => {
        todos = todos.filter((todo) => todo.id != id);

    } 

    const deleteAllTodos = () => {
        todos = [];
    }


    return {
        addTodo, getAllTodos, deleteTodo, deleteAllTodos, pdescription, pname, pid 
    };  
}

let ProjectList = []; 


const ProjectManager = (() => {
    

    const findProj = (projectArr, id) => {
        return (projectArr.find(project=>project.pid===id))
    }

    const addProject = (id,title="def",description="defa") => {
        let newProject = ProjectFactory(id,title,description);
        ProjectList.push(newProject);
    }

    const getAllProj = () => ProjectList;

    const getProjectbyId = (id) => findProj(ProjectList,id); 

    const deleteProject = (pid) => {
        ProjectList = ProjectList.filter((project) => project.pid != pid);
    }

    return {
        addProject,getAllProj,getProjectbyId, deleteProject
    }
})();





const TodoFactory = (id , name ='default task', description, dueDate= Date.now(), priority='low') => {
    return {id , name,description,dueDate,priority};
}
  


const buildDOMleft = (() => { 

    

    const createProjBut = document.createElement('button');
    createProjBut.textContent= "Add Project";
    createProjBut.id = "addproj";  
    const createTaskBut = document.createElement('button');
    createTaskBut.id = "addtask";
    

    left.appendChild(createProjBut); 

    
    const projectListDisplay = () => {
        projectIndex.innerHTML='';

    ProjectList.forEach(function(project) {
        
        projectIndex.style.listStyleType = "none";
        const projectLine = document.createElement('table');
        const title = document.createElement ('td'); 
        const deleteP = document.createElement('td'); 


        const projectid=project.pid;
        const projectname=project.pname;

        title.id = project.pid;
        title.dataset.id=project.pid;
        title.textContent = project.pname; 

        deleteP.textContent='Delete';
        deleteP.dataset.id = project.pid;

        deleteP.addEventListener('click' , deleteProj)
        

        title.addEventListener('mouseover', function onHover(event) {
            event.target.style.color="red";
        });
        title.addEventListener('mouseout', function outHover(event){
            event.target.color="#4D8EE5"; 
        }) 

        const displayClickedProj = () => {
            
            event.target.style.fontWeight='bold'; 
            const projectHeading= document.getElementById('projectHeading');
            projectHeading.textContent= projectname;
            projectHeading.dataset.id= title.dataset.id;

            const currentProject = getCurrentProject();
            const todos=currentProject.getAllTodos();
            taskListDisplay();
                

               
            
            
            createTaskBut.textContent="Add Task"; 
            
            projectBox.append(createTaskBut);   
            
            
        } 

        const handleAddTask = (createTaskBut, taskFormDiv) => {
            let newtaskid = uuidv4();
            let taskTitle = document.getElementById('taskTitle').value; 
            let taskDescription= document.getElementById('taskDescription').value;
            
            const currentProject = getCurrentProject();
            currentProject.addTodo(newtaskid,taskTitle,taskDescription);
            projectBox.replaceChild(createTaskBut , taskFormDiv);
            console.log(currentProject);
        
            taskListDisplay();

            

        } 

        

        const taskListDisplay = () => { 
            const currentProject = getCurrentProject();
            const todos=currentProject.getAllTodos();
            console.log(todos); 

            taskList.style.listStyleType="none";
            taskList.innerHTML='';
            todos.forEach(function (todo) {
                const task= document.createElement('table')
                task.id="task";
                const name = document.createElement('td');
                const desc = document.createElement('td');
                const due = document.createElement('td');
                const priority = document.createElement('td'); 
                const deleteBut = document.createElement('button');
                

                name.textContent=todo.name;
                desc.textContent=todo.description;
                deleteBut.textContent="Delete"; 
                deleteBut.dataset.id = todo.id; 
                const deleteId = deleteBut.dataset.id

                

                deleteBut.addEventListener('click' , deleteTask);

                task.append(name, desc, deleteBut);
                taskList.appendChild(task);
                
                projectBox.insertBefore(taskList,createTaskBut);

                
            })
        } 

        const deleteTask = (event) => {
            const currentProject = getCurrentProject();
            const currentTodo=event.target.dataset.id;
            console.log(currentTodo);
            currentProject.deleteTodo(currentTodo); 
            taskListDisplay();
         }

        const displayTaskForm = () => {
        
            let taskFormDiv = document.createElement('div');
            taskFormDiv.innerHTML = `
            <input id= 'taskTitle' type='text' placeholder='Type task' /> 
            <input id= 'taskDescription' type='text' placeholder='Type description' />
            <input id = 'taskDate' type='date' />
            `  
            let addTaskBut = document.createElement('button');
            addTaskBut.innerHTML = "Add"; 
            addTaskBut.type='submit';
            let cancelAddTask = document.createElement('button'); 
            cancelAddTask.innerHTML="Cancel"; 

            cancelAddTask.addEventListener('click' , function(event) {
                projectBox.replaceChild(createTaskBut , taskFormDiv)
            }) 
            addTaskBut.addEventListener('click', () => handleAddTask(createTaskBut, taskFormDiv));

            taskFormDiv.append(addTaskBut,cancelAddTask); 
            projectBox.replaceChild(taskFormDiv,createTaskBut);

            return taskFormDiv; 
    
        }

       
        
        createTaskBut.addEventListener('click', displayTaskForm);
        
        
    

        title.addEventListener('click', displayClickedProj) /*  {
            
            event.target.style.fontWeight='bold'; 
            const projectHeading= document.getElementById('projectHeading');
            
            projectHeading.textContent= projectname;
        }); */

        

        
         
        projectLine.append(title, deleteP);
        projectIndex.appendChild(projectLine);
        left.insertBefore(projectIndex, createProjBut); 
        
    }
    )};
    
    projectListDisplay();

    const displayProjForm = () => {
        // createProjBut.style='none';
        let projFormDiv = document.createElement('div');
        projFormDiv.innerHTML= `
        <input id='projectTitle' type='text' placeholder='Type title' />
        <input id='projectDesc' type='text' placeholder='Type project description'/>
        `
        let addProjBut= document.createElement('button');
        addProjBut.innerHTML='Add';
        addProjBut.type='submit';

        let CancelBut= document.createElement('button');
        CancelBut.innerHTML='Cancel';

        const cancelForm = () => {
            left.replaceChild(createProjBut, projFormDiv); 
        } 

        CancelBut.addEventListener('click', cancelForm); 
        addProjBut.addEventListener('click', () => handleAddProject(createProjBut,projFormDiv));
        
        projFormDiv.append(addProjBut, CancelBut);
        left.replaceChild(projFormDiv, createProjBut);  
        
        return projFormDiv;
    }
    
    const handleAddProject = (createProjBut,projFormDiv) => {
        let newProjid= uuidv4();
        let projectTitle= document.getElementById('projectTitle').value;
        let projectDescription= document.getElementById('projectDesc').value;

        ProjectManager.addProject(newProjid,projectTitle,projectDescription);
        left.replaceChild(createProjBut, projFormDiv);
        console.log(ProjectList);
        projectListDisplay();
    }

    
    const deleteProj = () => {
        
        const currentProj= event.target.dataset.id;
        
        ProjectManager.deleteProject(currentProj); 
    
        projectListDisplay();
    }

    createProjBut.addEventListener('click', displayProjForm); 
   


})(); 

  

const getCurrentProject = () => {
    let projectHeading=document.getElementById('projectHeading');
    let pid=projectHeading.dataset.id; 
    
    return ProjectManager.getProjectbyId(pid);
} 







function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
