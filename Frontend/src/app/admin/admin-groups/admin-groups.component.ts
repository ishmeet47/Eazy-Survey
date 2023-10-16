import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Group } from 'src/app/modules/group.module';
import { SurveyService } from 'src/app/services/survey.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-groups',
  templateUrl: './admin-groups.component.html',
  styleUrls: ['./admin-groups.component.css'],
})
export class AdminGroupsComponent implements OnInit {
  groups: Group[] = [];
  selectedUserGroups: number[] = [];

  newGroupName: string;

  selectedUser: number | undefined;
  selectedGroup: number | undefined;

  errorMessage!: string; // To store any error messages
  validationMessage!: string; // To store validation messages

  selectedGroupIds: number[] = [];
  groups$: Observable<Group[]>;
  editingGroups: Group[] = [];

  showDeleteConfirmationModal = false;
  selectDeleteGroup: Group | undefined;

  constructor(
    private userService: UserService,
    private surveyService: SurveyService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {
    this.newGroupName = '';
    this.groups$ = this.userService.getGroups();
  }

  ngOnInit() {
    this.loadGroups();
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
        }
      );
    } else {
      // Handle invalid input (like only spaces)
      this.validationMessage = 'Group name cannot be empty or just whitespace.';
    }
  }

  deleteGroup(group: any): void {
    // Logging details
    console.log('Deleting group: ', group.name);

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

  closeEditModal(): void {
    this.selectedUserGroups = undefined || [];
    this.editingGroups.forEach((group) => (group.selected = false));
  }
}
