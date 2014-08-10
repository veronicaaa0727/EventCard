//
// Created by Matt on 8/8/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "JoinViewController.h"
#import "AppDelegate.h"
#import "PeopleViewController.h"


@implementation JoinViewController {
    IBOutlet UIWebView *eventWebView;
}

- (void)viewDidLoad {
    NSURL *requestURL = [[NSURL alloc] initWithString:@"http://www.example.com"];
    NSURLRequest *descriptionRequest = [NSURLRequest requestWithURL:requestURL];
    eventWebView.opaque = NO;
    eventWebView.backgroundColor = [UIColor clearColor];
    [eventWebView loadRequest:descriptionRequest];
}


- (IBAction)joinButtonPressed {
    self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
    [self dismissViewControllerAnimated:YES completion:^{
        PeopleViewController *peopleController = [[PeopleViewController alloc] initWithNibName:nil bundle:nil];
        [gNavController pushViewController:peopleController animated:YES];
    }];
}


@end