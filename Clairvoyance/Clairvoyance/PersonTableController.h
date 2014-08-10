//
// Created by Matt on 8/10/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface PersonTableController : NSObject <UITableViewDataSource, UITableViewDelegate> {
@public
    int numPeople;
    BOOL showAddButton;
}
@end