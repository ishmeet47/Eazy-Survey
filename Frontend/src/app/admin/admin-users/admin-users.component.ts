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
      console.log(groups); // <-- check the main response here

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
}
