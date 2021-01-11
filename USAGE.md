# Application manual

## Initial screen

![Project creator screenshot](/doc/img/project_creator.png)

### Login options
On the image above you can see what unregistered user sees first time opening the application.
In the top right *Login options* are displayed. The application allows unregistered users to create/import and edit graphs,
but it does not allow the user to save his project to the server.
The login button allows the user to login and use full functionality of the application.
The register button allows the user to create new account, the account must first be activated by an administrator to
allow access to other parts of the app.
Upon logging in the options will be replaced by users full name and logout button.

Note that upon initialization there are 2 default users with following usernames / passwords:
Administrator: admin / pass
User: user / pass

### Project menu
In the top left corner resides the *Project menu* from which the user can create new projects.   
Registered users can also save and load projects from remote storage here.
If there is more than a single projects open, there will be project tabs visible above the menu bar, which function in a
manner similar to web browser tabs.

## Project creator
Upon creating new project or opening the application for the first time a project creator wizard will be shown.
This wizard allows the user to import documents from CSV data, or quickly create a random graph for testing purposes.
Alternatively the user can choose to create empty document.

### File upload
The user can upload node/edge data using the dropzone. After uploading the node information, the user can select which
columns map to which node property. This is also true for edge information. The box below import shows how many elements
were imported.

### Random generator
In the top right corner of the import box resides a button which allows the user to create random graphs.
This feature is useful for testing purposes, but due to performance reasons it's not advised to exceed 10000 nodes.

## Graph editor

![Graph editor screenshot](/doc/img/graph_editor.png)

In the picture above you can see the graph editor interface. Most of the page is taken up by the graph editor canvas.
This canvas visually shows the graph nodes and edges as circles and arrows, where circle represents node and arrow edge
between nodes. You can scroll the canvas using right or middle mouse button. Zooming can be done using the mouse wheel.
Hovering on a node will show tooltip showing the node information.

Upon first opening a project you may need to recalculate the layout using the green button in the bottom left. This is
because by default the nodes don't contain any layout information.

### Basic graph operations
The group of three buttons allows the user to modify the graph data manually, each represents a different tool.

The first one allows the user to select and move nodes in the canvas by clicking or dragging them.

The second one allows the user to add new nodes by clicking on empty space in the canvas. Clicking on a node and
dragging on a different node will create an edge between these two nodes.

The last tool is the removal tool, it allows the user to remove nodes by clicking on them. All edges going from/to
the node will be also removed.

### Using external libraries

You can run the data though an external library using the button in the middle. This will open a dialog box where the
user can select which library to use, and also fill in any parameters which are required by the library.

The values calculated by the library are saved into the `personalization` node property. It can be inspected by
hovering above any node.

## Administration

![User administration screenshot](/doc/img/admin_users.png)

The administration interface can only be accessed by users with administrator role. If the user is an administrator,
the administration can be accessed by clicking the button on the top of the page, next to projects button. The projects
button will return the user back to the primary interface.

Individual administration categories can be accessed using the menu on the left side of the page.

### User administration
The users can be managed from a user table. On the image above there are three users present - administrator, regular
user and user whose account has not yet been activated.

Clicking on a user will open user details dialog, where the administrator can change users name, email, password and
roles in the system. Any new user account can be activated by assigning him to a role.

Cross on the right side of the user row will delete the user from a system.

Button above the table can be used to create new users manually.

### Library administration

![Library administration screenshot](/doc/img/admin_libs.png)

New libraries can be uploaded to the server using this interface. The upload button opens a dialog where the user can
upload the library JAR, input name and description and any additional parameters.

The table lists all libraries currently present in the system. clicking the cross on the right side of each row will
remove selected library from system.
