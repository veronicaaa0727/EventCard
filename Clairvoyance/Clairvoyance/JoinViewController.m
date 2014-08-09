//
// Created by Matt on 8/8/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "JoinViewController.h"
#import "AppDelegate.h"
#import "PeopleViewController.h"


@implementation JoinViewController {

}

- (IBAction)joinButtonPressed {
    self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
    [self dismissViewControllerAnimated:YES completion:^{
        PeopleViewController *peopleController = [[PeopleViewController alloc] initWithNibName:nil bundle:nil];
        [gNavController pushViewController:peopleController animated:YES];
    }];
}


@end