//
// Created by Matt on 8/10/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "EventCircle.h"


@implementation EventCircle {

}

+ (id)circleWithName:(NSString *)theName x:(float)xCoord y:(float)yCoord radius:(float)theRadius url:(NSString *)theURL {
    EventCircle *circle = [[EventCircle alloc] init];
    circle->name = theName;
    circle->x = xCoord;
    circle->y = yCoord;
    circle->radius = theRadius;
    circle->url = theURL;
    return circle;
}

- (BOOL)containsPoint:(CGPoint)point {
    float dx = point.x - x;
    float dy = point.y - y;
    float distanceSquared = dx * dx + dy * dy;
    return (distanceSquared < radius * radius);

}

@end