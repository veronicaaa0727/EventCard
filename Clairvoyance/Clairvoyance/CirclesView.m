//
// Created by Matt on 8/8/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "CirclesView.h"


@implementation CirclesView {
    float lastX;
    float scrollX;
}

- (void)drawEventName:(NSString *)name x:(float)x y:(float)y radius:(float)r {
    CGRect circleRect = CGRectZero;
    circleRect.origin = CGPointMake(x, y);
    circleRect = CGRectInset(circleRect, -r, -r);

    [[self blueGreenColor] set];
    [[UIBezierPath bezierPathWithOvalInRect:circleRect] fill];

    UIFont *eventFont = [UIFont systemFontOfSize:24];


    NSDictionary *nameAttributes = @{
            NSFontAttributeName : eventFont,
            NSForegroundColorAttributeName : [UIColor whiteColor]
    };

    CGSize nameSize = [name sizeWithAttributes:nameAttributes];
    x -= nameSize.width * .5;
    y -= nameSize.height * .5;
    [name drawAtPoint:CGPointMake(x, y) withAttributes:nameAttributes];

}

- (UIColor *)blueGreenColor {
    float r = 0;
    float g = .5 + drand48() * .5;
    float b = .5 + drand48() * .5;
    return [UIColor colorWithRed:r green:g blue:b alpha:1];
}

- (void)drawRect:(CGRect)rect {
    [[UIColor blackColor] set];
    [[UIBezierPath bezierPathWithRect:rect] fill];

    // seed the random generator so we get the same colors each draw
    srand48(0);

    CGContextRef c = UIGraphicsGetCurrentContext();

    CGContextSaveGState(c);

    CGContextTranslateCTM(c, scrollX, 0);

    [self drawEventName:@"WWDC" x:200 y:200 radius:100];
    [self drawEventName:@"Meetup" x:300 y:400 radius:70];
    [self drawEventName:@"Google IO" x:100 y:400 radius:100];
    [self drawEventName:@"Party" x:350 y:250 radius:100];

    CGContextRestoreGState(c);
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    CGPoint p = [touch locationInView:self];
    lastX = p.x;
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    CGPoint p = [touch locationInView:self];
    float dx = p.x - lastX;
    lastX = p.x;

    scrollX += dx;

    [self setNeedsDisplay];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    [super touchesEnded:touches withEvent:event];
}


@end