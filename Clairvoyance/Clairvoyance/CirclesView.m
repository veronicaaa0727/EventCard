//
// Created by Matt on 8/8/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "CirclesView.h"


@implementation CirclesView {

}

- (void)drawEventName:(NSString *)name x:(float)x y:(float)y radius:(float)r {
    CGRect circleRect = CGRectZero;
    circleRect.origin = CGPointMake(x, y);
    circleRect = CGRectInset(circleRect, -r, -r);

    [[UIColor colorWithRed:0 green:1 blue:1 alpha:1] set];
    [[UIBezierPath bezierPathWithOvalInRect:circleRect] fill];
}

- (void)drawRect:(CGRect)rect {
    [[UIColor blackColor] set];
    [[UIBezierPath bezierPathWithRect:rect] fill];

    [self drawEventName:@"WWDC" x:200 y:200 radius:100];

}


@end