import { Component, OnInit } from '@angular/core';

import { ServersService } from '../servers.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CanComponentDeactivate } from './can-deactivate-guard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css'],
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: { id: number; name: string; status: string };
  serverName = '';
  serverStatus = '';
  allowEdit = false;
  chagesSaved = false;

  constructor(
    private serversService: ServersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  canDeactivate(): boolean | Promise<boolean> | Observable<boolean> {
    if (!this.allowEdit) {
      return true;
    }
    if (
      (this.serverName !== this.server.name ||
        this.serverStatus !== this.server.status) &&
      !this.chagesSaved
    ) {
      return confirm('Do you want to discard the changes?');
    } else {
      return true;
    }
  }

  ngOnInit() {
    this.server = this.serversService.getServer(
      +this.route.snapshot.params['id']
    );
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
    this.allowEdit =
      this.route.snapshot.queryParams['allowEdit'] === '1' ? true : false;

    this.route.params.subscribe((params: Params) => {
      this.server = this.serversService.getServer(+params['id']);
      this.serverName = this.server.name;
      this.serverStatus = this.server.status;
    });

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
    });
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {
      name: this.serverName,
      status: this.serverStatus,
    });
    this.chagesSaved = true;
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
