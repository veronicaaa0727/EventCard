//
// Created by Matt on 8/10/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface EventCircle : NSObject {
@public
    NSString *name;
    float x, y, radius;
}
+ (id)circleWithName:(NSString *)theName x:(float)xCoord y:(float)yCoord radius:(float)theRadius;

- (BOOL)containsPoint:(CGPoint)point;
@end