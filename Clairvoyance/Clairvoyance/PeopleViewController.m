//
// Created by Matt on 8/8/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "PeopleViewController.h"
#import "AppDelegate.h"
#import "ContactsViewController.h"


@implementation PeopleViewController {

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
    tableView.dataSource = self;
    tableView.delegate = self;
    tableView.rowHeight = 100;
    self.view = tableView;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:@"cell"];
    // ideally should do a dequereusablecell call
    cell.textLabel.text = @"Joe Smith";
    cell.detailTextLabel.text = @"Software Engineer";
    UIButton *connectButton = [UIButton buttonWithType:UIButtonTypeContactAdd];

    cell.accessoryView = connectButton;
    return cell;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}


@end