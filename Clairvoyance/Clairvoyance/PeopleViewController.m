//
// Created by Matt on 8/8/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "PeopleViewController.h"
#import "AppDelegate.h"
#import "ContactsViewController.h"
#import "PersonDetailController.h"
#import "PersonTableController.h"


@implementation PeopleViewController {
    PersonTableController * tableController;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.navigationItem.title = @"People";
        UIBarButtonItem *contactsItem = [[UIBarButtonItem alloc] initWithTitle:@"Contacts"
                                                                         style:UIBarButtonItemStylePlain
                                                                        target:self
                                                                        action:@selector(openContacts)];
        self.navigationItem.rightBarButtonItem = contactsItem;
    }

    return self;
}

- (void)openContacts {
    UIViewController *contactsController = [[ContactsViewController alloc] initWithNibName:nil bundle:nil];
    [gNavController pushViewController:contactsController animated:YES];
}

- (void)loadView {
    UITableView *tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
    tableController = [[PersonTableController alloc] init];
    tableController->numPeople = 20;
    tableController->showAddButton = YES;
    tableView.dataSource = tableController;
    tableView.delegate = tableController;
    tableView.rowHeight = 110;
    self.view = tableView;
}


@end