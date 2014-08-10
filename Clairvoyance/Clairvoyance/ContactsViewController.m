//
// Created by Matt on 8/10/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "ContactsViewController.h"
#import "PersonTableController.h"


int gNumPeopleToShowInContacts = 0;

@implementation ContactsViewController {
    PersonTableController *tableController;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.navigationItem.title = @"Contacts";
    }

    return self;
}

- (void)loadView {
    UITableView *tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
    tableController = [[PersonTableController alloc] init];
    tableController->numPeople = gNumPeopleToShowInContacts;
    NSLog(@"num people to show in contacts %d", gNumPeopleToShowInContacts);
    tableView.dataSource = tableController;
    tableView.delegate = tableController;
    tableView.rowHeight = 110;
    self.view = tableView;
    [tableView reloadData];
}

@end