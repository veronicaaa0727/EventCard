//
// Created by Matt on 8/8/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "PeopleViewController.h"
#import "AppDelegate.h"
#import "ContactsViewController.h"
#import "PersonDetailController.h"


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
    tableView.rowHeight = 110;
    self.view = tableView;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    UITableViewCell *cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"cell"];
    // ideally should do a dequereusablecell call

    UIImageView *profileView = [[UIImageView alloc] initWithFrame:CGRectMake(10, 10, 50, 50)];
    [profileView setImage:[UIImage imageNamed:@"Sample_profile_image.png"]];
    [cell addSubview:profileView];

    UILabel *nameLabel = [[UILabel alloc] initWithFrame:CGRectMake(70, 10, 200, 30)];
    nameLabel.text = @"Joe Smith";
//    cell.textLabel.frame = CGRectMake(50, 10, 200, 30);
    [cell addSubview:nameLabel];
    UILabel *subtitleLabel = [[UILabel alloc] initWithFrame:CGRectMake(70, 30, 200, 30)];
    subtitleLabel.text = @"Software Engineer";
    subtitleLabel.textColor = [UIColor grayColor];
    [cell addSubview:subtitleLabel];

    UILabel *detailsLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 50, 250, 60)];
    detailsLabel.numberOfLines = 2;
    detailsLabel.text = @"Joe is the staff engineer at Google who can write mobile apps";
    detailsLabel.font = [UIFont systemFontOfSize:14];

    [cell addSubview:detailsLabel];


    UIButton *connectButton = [UIButton buttonWithType:UIButtonTypeContactAdd];

    cell.accessoryView = connectButton;
    return cell;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    PersonDetailController *detailController = [[PersonDetailController alloc] initWithNibName:@"PersonDetailView" bundle:nil];
    [gNavController pushViewController:detailController animated:YES];
}


@end