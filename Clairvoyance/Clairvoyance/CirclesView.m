//
// Created by Matt on 8/8/14.
// Copyright (c) 2014 Clairvoyance. All rights reserved.
//

#import "CirclesView.h"
#import "CircleScreenController.h"
#import "AppDelegate.h"
#import "JoinViewController.h"
#import "EventCircle.h"


@implementation CirclesView {
    float lastX;
    float scrollX;
    float inertiaX;
    float lastVelocity;
    BOOL scrolled;

    NSMutableArray *circles;
    int circleSelected;

    double lastEventTime;
}

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        circles = [[NSMutableArray alloc] init];
//
//
//        [self drawEventName:@"WWDC" x:200 y:200 radius:100];
//        [self drawEventName:@"Meetup" x:300 y:400 radius:70];
//        [self drawEventName:@"Google IO" x:100 y:400 radius:100];
//        [self drawEventName:@"Party" x:350 y:250 radius:100];

        [circles addObject:[EventCircle circleWithName:@"WWDC" x:200 y:200 radius:100]];
        [circles addObject:[EventCircle circleWithName:@"Meetup" x:300 y:400 radius:70]];
        [circles addObject:[EventCircle circleWithName:@"Google" x:100 y:400 radius:100]];
        [circles addObject:[EventCircle circleWithName:@"Party" x:350 y:250 radius:100]];
        circleSelected = -1;
    }

    return self;
}


- (void)drawEventName:(NSString *)name x:(float)x y:(float)y radius:(float)r selected:(BOOL)isSelected {
    float angle = drand48() * M_PI * 2;
    double time = [NSDate timeIntervalSinceReferenceDate];
    double progress = time - floor(time);
    float angleOffset = progress * M_PI * 2;
    angle += angleOffset;
    x += cosf(angle) * 5;
    y += sinf(angle) * 5;

    [[self blueGreenColor] set];
    // should request bluegreencolor even if circle not selected in order not to throw off random number generation
    if (isSelected) {
        [[UIColor yellowColor] set];
//        r += 15; tried making circle bigger when pressed, but doesn't really look better...
        // might work if change was animated instead of instant
    }
    CGRect circleRect = CGRectZero;
    circleRect.origin = CGPointMake(x, y);
    circleRect = CGRectInset(circleRect, -r, -r);

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
//    [[UIColor blackColor] set];
    if (inertiaX) scrollX += inertiaX;
    inertiaX *= .96;
    if (fabsf(inertiaX) < .01) inertiaX = 0;

    [[UIColor colorWithRed:.1 green:.1 blue:.15 alpha:1] set];

    [[UIBezierPath bezierPathWithRect:rect] fill];

    UIColor *promptColor = [UIColor colorWithRed:1 green:.9 blue:.9 alpha:1];
    UIFont *promptFont = [UIFont systemFontOfSize:24];
    NSDictionary *promptAttributes = @{
            NSFontAttributeName : promptFont,
            NSForegroundColorAttributeName : promptColor
    };
    [@"Land on your" drawAtPoint:CGPointMake(10, 26) withAttributes:promptAttributes];


    // seed the random generator so we get the same colors each draw
    srand48(0);

    CGContextRef c = UIGraphicsGetCurrentContext();

    CGContextSaveGState(c);

    CGContextTranslateCTM(c, scrollX, 0);

    for (int i = 0; i < [circles count]; ++i) {
        EventCircle *circle = circles[i];
        [self drawEventName:circle->name x:circle->x y:circle->y radius:circle->radius selected:(i == circleSelected)];
    }
//    for (EventCircle *circle in circles) {
//        [self drawEventName:circle->name x:circle->x y:circle->y radius:circle->radius];
//    }
//    [self drawEventName:@"WWDC" x:200 y:200 radius:100];
//    [self drawEventName:@"Meetup" x:300 y:400 radius:70];
//    [self drawEventName:@"Google IO" x:100 y:400 radius:100];
//    [self drawEventName:@"Party" x:350 y:250 radius:100];

    CGContextRestoreGState(c);

    [self performSelector:@selector(setNeedsDisplay) withObject:nil afterDelay:0];
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    CGPoint p = [touch locationInView:self];
    lastX = p.x;

    scrolled = NO;
    inertiaX = 0;

    circleSelected = -1;
    p.x -= scrollX;
    for (int i = 0; i < [circles count]; ++i) {
        EventCircle *circle = circles[i];
        if ([circle containsPoint:p]) {
            circleSelected = i;
        }
    }
    lastVelocity = 0;
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    UITouch *touch = [touches anyObject];
    CGPoint p = [touch locationInView:self];
    float dx = p.x - lastX;
    lastX = p.x;

    double eventTime = [NSDate timeIntervalSinceReferenceDate];
    double dt = eventTime - lastEventTime;

    if (dt < 1) {
        lastVelocity = dx / dt;

    }

    scrollX += dx;

    scrolled = YES;

    lastEventTime = eventTime;

    [self setNeedsDisplay];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {

    if (!scrolled) {
        if (circleSelected != -1) {
            EventCircle *circle = circles[circleSelected];

            CircleScreenController *controller = (CircleScreenController *)[gNavController topViewController];
            JoinViewController *joinViewController = [[JoinViewController alloc] initWithNibName:@"JoinView" bundle:nil event:circle];
            joinViewController.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal;
            [controller presentViewController:joinViewController animated:YES completion:nil];
        }


    }
    else {
        NSLog(@"starting inertial scroll with velocity %f", lastVelocity);

        if (lastVelocity < -500) lastVelocity = -500;
        if (lastVelocity > 500) lastVelocity = 500;
        inertiaX = lastVelocity * .014;
    }

    circleSelected = -1;
}


@end