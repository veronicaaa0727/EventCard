//
// Created by Matt on 8/8/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "JoinViewController.h"
#import "AppDelegate.h"
#import "PeopleViewController.h"
#import "EventCircle.h"


@implementation JoinViewController {
    IBOutlet UILabel *eventNameLabel;
    IBOutlet UIWebView *eventWebView;
    EventCircle *event;
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil event:(EventCircle *)eventCircle {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        event = eventCircle;
    }

    return self;
}


- (void)viewDidLoad {
    NSURL *requestURL = [[NSURL alloc] initWithString:@"http://developer.apple.com/wwdc/"];
    NSURLRequest *descriptionRequest = [NSURLRequest requestWithURL:requestURL];
    eventWebView.opaque = NO;
    eventWebView.backgroundColor = [UIColor clearColor];
    [eventWebView loadRequest:descriptionRequest];

//    NSLog(@"event web view %@", eventWebView);
//    NSLog(@"setting event name label %@ to %@", eventNameLabel, event->name);
    eventNameLabel.text = event->name;
}


- (IBAction)joinButtonPressed {
    self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
    [self dismissViewControllerAnimated:YES completion:^{
        PeopleViewController *peopleController = [[PeopleViewController alloc] initWithNibName:nil bundle:nil];
        [gNavController pushViewController:peopleController animated:YES];
    }];
}

- (IBAction)backButtonPressed {
    self.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal;
    [self dismissViewControllerAnimated:YES completion:nil];
}


@end