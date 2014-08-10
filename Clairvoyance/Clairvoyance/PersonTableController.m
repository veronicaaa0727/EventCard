//
// Created by Matt on 8/10/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "PersonTableController.h"
#import "ContactsViewController.h"


@implementation PersonTableController {

}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return numPeople;
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


    if (showAddButton) {
        UIButton *connectButton = [UIButton buttonWithType:UIButtonTypeContactAdd];
        [connectButton addTarget:self action:@selector(addContactPressed:) forControlEvents:UIControlEventTouchUpInside];
        cell.accessoryView = connectButton;
    }

    return cell;
}

- (IBAction)addContactPressed:(UIButton *)sender {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Contact Added"
                                                    message:@"Joe Smith has been added to your contact list in Clairvoyance"
                                                   delegate:self
                                          cancelButtonTitle:@"OK"
                                          otherButtonTitles:nil];
    [alert show];
    ++gNumPeopleToShowInContacts;
}

- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex {
    NSLog(@"add contact alert dismissed");

}


- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

@end