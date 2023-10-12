import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IKeyValuePair } from 'src/app/models/IKeyValuePair';
import { Group } from 'src/app/modules/group.module';
import { User } from 'src/app/modules/user.module';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
})
export class AdminUsersComponent implements OnInit {
  passwordVisibility: boolean = false; // To toggle password visibility

  users: User[] = [];
  groups: Group[] = [];
  dropdownGroups: IKeyValuePair[] = []; // For group dropdown

  // For creating a new user
  newUsername: string;
  newPassword: string;
  selectedUserGroups: number[] = [];

  // For editing a user
  editingUser: User | null = null; // Currently edited user

  // For creating a new group
  newGroupName: string;

  // For adding user to a group
  selectedUser: number | undefined;
  selectedGroup: number | undefined;

  errorMessage!: string; // To store any error messages
  validationMessage!: string; // To store validation messages

  newSurveyTitle: string = '';
  newSurveyDueDate!: Date | null;
  newSurveyQuestions: string = '';
  newErrorMessage: string = '';

  selectedGroupIds: number[] = [];
  groups$: Observable<Group[]>;
  editingGroups: Group[] = [];

  constructor(
    private userService: UserService,
    private surveyService: SurveyService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.newUsername = '';
    this.newPassword = '';
    this.newGroupName = '';
    this.groups$ = this.userService.getGroups();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
    this.newUsername = '';
    this.newPassword = '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisibility = !this.passwordVisibility;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((response: any) => {
      // Check if $values property exists and assign
      if (response && response.$values) {
        this.users = response.$values;

        // Normalize userGroups and surveysCompleted, if needed
        this.users.forEach((user) => {
          if (user.userGroups && user.userGroups.$values) {
            user.userGroups.groups = user.userGroups.$values;
          }
          if (user.surveysCompleted && user.surveysCompleted.$values) {
            // Just to ensure the $values property is correctly set
            user.surveysCompleted.$values = user.surveysCompleted.$values;
          }
        });
      }
      console.log(this.users);
    });
  }

  loadGroups(): void {
    this.userService.getGroups().subscribe((groups) => {
      console.log('Groups: ' + groups);
      // console.log(groups); // <-- check the main response here

      if (groups && Array.isArray(groups)) {
        this.groups = groups.map((group) => ({ ...group, selected: false }));
      } else {
        console.error('Unexpected data structure:', groups);
      }

      this.cd.detectChanges();

      this.dropdownGroups = this.groups.map((group) => ({
        key: group.id,
        value: group.name,
      }));
    });
  }

  isGroupSelected(groupId: number): boolean {
    const matchingGroup = this.editingGroups.find((g) => g.id === groupId);
    return matchingGroup ? !!matchingGroup.selected : false;
  }

  toggleGroupSelection(groupId: number): void {
    // First, update the selection status for the editingGroups
    const editingGroup = this.editingGroups.find((g) => g.id === groupId);
    if (editingGroup) {
      editingGroup.selected = !editingGroup.selected;
    }

    console.log('Updated editing groups:', this.editingGroups);
  }

  addUser(): void {
    const userPayload: any = {
      username: this.newUsername,
      password: this.newPassword,
    };

    // Gather the selected group IDs based on checkbox selection from groups list
    userPayload.groupIds = this.groups
      .filter((group) => group.selected)
      .map((group) => group.id);

    this.userService.createUser(userPayload).subscribe(() => {
      this.newUsername = '';
      this.newPassword = '';
      // Reset the group selections in the groups list
      this.groups.forEach((group) => (group.selected = false));
      this.loadUsers();
    });
  }

  createGroup(): void {
    this.errorMessage = ''; // Clear previous error messages
    this.validationMessage = ''; // Clear previous validation messages

    if (this.newGroupName && this.newGroupName.trim() !== '') {
      this.userService.createGroup(this.newGroupName).subscribe(
        () => {
          // Handle successful creation
          this.newGroupName = '';
          // Refresh the list of groups after creating a new one
          this.loadGroups();
        },
        (error) => {
          // Handle server-side errors
          this.errorMessage =
            'There was an issue creating the group. Please try again later.';
          // Optionally extract a more detailed message from the error object if your server provides one
          // this.errorMessage = error.message || 'There was an issue creating the group. Please try again later.';
        }
      );
    } else {
      // Handle invalid input (like only spaces)
      this.validationMessage = 'Group name cannot be empty or just whitespace.';
    }
  }

  addUserToGroup(): void {
    // Check if a user is selected
    if (this.selectedUser === undefined) {
      console.error('No user selected');
      return; // or handle this case in a different way
    }

    const selectedGroups = this.groups
      .filter((group) => group.selected)
      .map((group) => group.id);

    // Use a type assertion to assure TypeScript that `this.selectedUser` is a number
    const payload = {
      userId: this.selectedUser as number,
      groupIds: selectedGroups,
    };

    this.userService.addUserToGroups(payload).subscribe(() => {
      // You can reset selections and reload data if needed here
      this.groups.forEach((group) => (group.selected = false));
    });
  }

  deleteUser(userId: number | undefined): void {
    if (typeof userId !== 'number') {
      console.error('Invalid user ID:', userId);
      return;
    }

    this.userService.deleteUser(userId).subscribe(() => {
      this.loadUsers();
    });
  }

  deleteGroup(group: any): void {
    // Logging details
    console.log('Deleting group: ', group.name);
    console.log('User details: ', this.editingUser);

    // Call the service method to delete the group by its ID
    this.userService.deleteGroupById(group.id).subscribe(
      () => {
        console.log('Group deleted successfully.');
        // If the group is deleted successfully, load all the groups again.
        this.loadGroups();
      },
      (error) => {
        console.error('Error deleting group:', error);
        // Handle any errors here, maybe show an error message to the user.
      }
    );
  }

  editUser(user: any): void {
    this.editingUser = { ...user }; // Create a copy of user to avoid direct mutations

    // Clone the groups to editingGroups
    this.editingGroups = JSON.parse(JSON.stringify(this.groups));

    // Clear any previous selections in the editingGroups list
    this.editingGroups.forEach((group) => (group.selected = false));

    if (
      this.editingUser &&
      this.editingUser.userGroups &&
      this.editingUser.userGroups.$values
    ) {
      // Mark the groups that the user is a part of as selected in the editingGroups list
      this.editingUser.userGroups.$values.forEach((userGroup) => {
        const matchingGroup = this.editingGroups.find(
          (g) => g.id === userGroup.groupId
        );
        if (matchingGroup) {
          matchingGroup.selected = true;
        }
      });
    }
  }

  updateUser(event: Event): void {
    event.preventDefault();
    if (this.editingUser) {
      const selectedGroups = this.editingGroups
        .filter((group) => group.selected)
        .map((group) => group.id);
      this.editingUser.groupIds = selectedGroups;
      console.log(this.editingUser.groupIds);
      this.userService.updateUser(this.editingUser).subscribe(() => {
        // After updating, you might want to reset the group selections in editingGroups, close the modal, and reload the list of users
        this.editingGroups.forEach((group) => (group.selected = false));
        this.editingUser = null; // reset the editing user
        this.loadUsers();
      });
    }
  }

  onGroupCheckboxChange(event: any, groupId: number): void {
    if (event.target.checked) {
      this.selectedGroupIds.push(groupId);
    } else {
      const index = this.selectedGroupIds.indexOf(groupId);
      if (index > -1) {
        this.selectedGroupIds.splice(index, 1);
      }
    }
  }

  navigateToSurveyComponent() {
    // Navigate to the survey component. Assuming you use Angular's Router.
    this.router.navigate(['/surveys']);
  }

  createSurvey(): void {
    // Validation (you can extend this as per your requirements)
    if (
      !this.newSurveyTitle.trim() ||
      !this.newSurveyDueDate ||
      !this.newSurveyQuestions.trim()
    ) {
      this.errorMessage = 'Please fill out all the fields.';
      return;
    }

    // Extract individual questions from the textarea content
    const questionsArray = this.newSurveyQuestions
      .split('\n')
      .filter((question) => question.trim() !== '');

    // Create the survey payload
    const surveyPayload = {
      title: this.newSurveyTitle,
      dueDate: this.newSurveyDueDate,
      questions: questionsArray,
    };

    this.surveyService.createSurvey(surveyPayload).subscribe(
      (response) => {
        // Handle successful creation (e.g., show a success message or refresh the list of surveys)
        this.errorMessage = ''; // clear any previous error messages
        this.newSurveyTitle = ''; // reset the fields
        this.newSurveyDueDate = null;
        this.newSurveyQuestions = '';

        // Optionally, show a success message or redirect somewhere or reload surveys
      },
      (error) => {
        // Handle error
        this.errorMessage = 'Failed to create the survey. Please try again.';
      }
    );
  }

  closeEditModal(): void {
    this.editingUser = null;
    this.selectedUserGroups = undefined || [];
    this.editingGroups.forEach((group) => (group.selected = false));
  }
}
